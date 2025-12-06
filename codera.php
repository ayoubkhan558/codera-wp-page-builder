<?php
/**
 * Plugin Name: Codera Page Builder
 * Description: A custom React-powered page builder for WordPress.
 * Version: 1.0.0
 * Author: Codera Team
 * Text Domain: codera
 */

if (!defined('ABSPATH')) {
    exit;
}

class Codera_Page_Builder
{

    public function __construct()
    {
        add_action('admin_menu', array($this, 'register_menu_page'));
        add_action('admin_enqueue_scripts', array($this, 'enqueue_scripts'));
        add_action('rest_api_init', array($this, 'register_rest_routes'));

        // Add Edit with Codera buttons
        add_filter('post_row_actions', array($this, 'add_row_actions'), 10, 2);
        add_filter('page_row_actions', array($this, 'add_row_actions'), 10, 2);
        add_action('edit_form_after_title', array($this, 'add_edit_button'));
    }

    public function register_menu_page()
    {
        add_menu_page(
            'Codera Builder',
            'Codera',
            'manage_options',
            'codera',
            array($this, 'render_admin_page'),
            'dashicons-layout',
            25
        );
    }

    public function render_admin_page()
    {
        echo '<div id="codera-app"></div>';
    }

    public function add_row_actions($actions, $post)
    {
        if (current_user_can('edit_post', $post->ID)) {
            $url = admin_url('admin.php?page=codera&post_id=' . $post->ID);
            $actions['codera_edit'] = '<a href="' . esc_url($url) . '">Edit with Codera</a>';
        }
        return $actions;
    }

    public function add_edit_button($post)
    {
        if (!current_user_can('edit_post', $post->ID)) {
            return;
        }
        $url = admin_url('admin.php?page=codera&post_id=' . $post->ID);
        echo '<div style="margin-top: 10px; margin-bottom: 20px;">';
        echo '<a href="' . esc_url($url) . '" class="button button-primary">Edit with Codera</a>';
        echo '</div>';
    }

    public function enqueue_scripts($hook)
    {
        if ('toplevel_page_codera' !== $hook) {
            return;
        }

        $post_id = isset($_GET['post_id']) ? intval($_GET['post_id']) : 0;

        $build_js = plugin_dir_url(__FILE__) . 'build/assets/main.js';
        $build_css_path = plugin_dir_path(__FILE__) . 'build/assets/main.css';
        $build_js_path = plugin_dir_path(__FILE__) . 'build/assets/main.js';

        if (file_exists($build_js_path)) {
            // Production
            wp_enqueue_script('codera-app', $build_js, array('wp-element'), '1.0.0', true);

            if (file_exists($build_css_path)) {
                wp_enqueue_style('codera-app-style', plugin_dir_url(__FILE__) . 'build/assets/main.css', array(), '1.0.0');
            }

        } else {
            // Development (Vite HMR)
            wp_enqueue_script('codera-vite-client', 'http://localhost:5173/@vite/client', array(), null, true);

            add_filter('script_loader_tag', function ($tag, $handle, $src) {
                if ($handle === 'codera-vite-client' || $handle === 'codera-app-dev') {
                    return '<script type="module" src="' . esc_url($src) . '"></script>';
                }
                return $tag;
            }, 10, 3);

            wp_enqueue_script('codera-app-dev', 'http://localhost:5173/src/index.jsx', array('codera-vite-client'), null, true);
        }

        wp_enqueue_style('codera-admin-style', plugin_dir_url(__FILE__) . 'assets/admin.css', array(), '1.0.0');

        $data = array(
            'root_url' => get_rest_url(null, 'codera/v1'),
            'nonce' => wp_create_nonce('wp_rest'),
            'post_id' => $post_id
        );

        wp_localize_script('codera-app', 'coderaData', $data);
        wp_localize_script('codera-app-dev', 'coderaData', $data);

    }

    public function register_rest_routes()
    {
        register_rest_route('codera/v1', '/save', array(
            'methods' => 'POST',
            'callback' => array($this, 'handle_save_layout'),
            'permission_callback' => function () {
                return current_user_can('edit_posts');
            },
        ));

        register_rest_route('codera/v1', '/load', array(
            'methods' => 'GET',
            'callback' => array($this, 'handle_load_layout'),
            'permission_callback' => function () {
                return current_user_can('edit_posts');
            },
        ));
    }

    public function handle_save_layout($request)
    {
        $params = $request->get_json_params();
        $post_id = isset($params['post_id']) ? intval($params['post_id']) : 0;
        $elements = isset($params['elements']) ? $params['elements'] : array();

        if ($post_id > 0) {
            update_post_meta($post_id, '_codera_layout', $elements);
            return new WP_REST_Response(array('success' => true, 'message' => 'Saved to Post Meta', 'data' => $elements), 200);
        } else {
            update_option('codera_default_layout', $elements);
            return new WP_REST_Response(array('success' => true, 'message' => 'Saved to Options (No Post ID provided)', 'data' => $elements), 200);
        }
    }

    public function handle_load_layout($request)
    {
        $post_id = $request->get_param('post_id');

        if ($post_id) {
            $data = get_post_meta($post_id, '_codera_layout', true);
        } else {
            $data = get_option('codera_default_layout', array());
        }

        if (!$data) {
            $data = array();
        }

        return new WP_REST_Response(array('success' => true, 'data' => $data), 200);
    }

}

new Codera_Page_Builder();
