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

    /**
     * Hook for the main menu page.
     *
     * @var string
     */
    private $page_hook;

    public function __construct()
    {
        // Admin Menu
        add_action('admin_menu', array($this, 'register_menu_page'));

        // Enqueue Scripts
        add_action('admin_enqueue_scripts', array($this, 'enqueue_scripts'));

        // REST API
        add_action('rest_api_init', array($this, 'register_rest_routes'));

        // Edit Buttons Integration
        // 1. Row Actions (Pages/Posts List)
        add_filter('post_row_actions', array($this, 'add_row_actions'), 10, 2);
        add_filter('page_row_actions', array($this, 'add_row_actions'), 10, 2);

        // 2. Meta Box (Block Editor / Classic Editor)
        add_action('add_meta_boxes', array($this, 'add_editor_meta_box'));

        // 3. Admin Bar (Frontend & Admin)
        add_action('admin_bar_menu', array($this, 'add_admin_bar_button'), 999);

        // Frontend Rendering
        add_filter('the_content', array($this, 'render_frontend_content'));

        // Post States (Pages List)
        add_filter('display_post_states', array($this, 'add_post_states'), 10, 2);
    }


    /**
     * Render the saved Codera layout on the frontend.
     */
    public function render_frontend_content($content)
    {
        // Ensure we are on the frontend and strictly on the single post/page logic
        if (is_admin() || !is_singular() || get_the_ID() !== get_queried_object_id()) {
            return $content;
        }

        $post_id = get_the_ID();
        $elements = get_post_meta($post_id, '_codera_layout', true);

        if (empty($elements) || !is_array($elements)) {
            return $content;
        }

        ob_start();
        echo '<div class="codera-content">';
        foreach ($elements as $element) {
            echo $this->render_element($element);
        }
        echo '</div>';
        return ob_get_clean();
    }

    /**
     * Helper function to render individual elements.
     */
    private function render_element($element)
    {
        $type = isset($element['type']) ? $element['type'] : '';
        $content = isset($element['content']) ? $element['content'] : array();
        $html = '';

        switch ($type) {
            case 'text':
                $styles = 'padding: 10px;';
                if (!empty($content['color']))
                    $styles .= ' color: ' . esc_attr($content['color']) . ';';
                if (!empty($content['fontSize']))
                    $styles .= ' font-size: ' . esc_attr($content['fontSize']) . ';';
                $html = sprintf(
                    '<div style="%s">%s</div>',
                    $styles,
                    wp_kses_post(isset($content['text']) ? $content['text'] : '')
                );
                break;

            case 'image':
                $width = isset($content['width']) ? $content['width'] : '100%';
                $src = isset($content['url']) ? $content['url'] : '';
                $alt = isset($content['alt']) ? $content['alt'] : '';
                if ($src) {
                    $html = sprintf(
                        '<div style="padding: 10px;"><img src="%s" alt="%s" style="width: %s; max-width: 100%%; height: auto;" /></div>',
                        esc_url($src),
                        esc_attr($alt),
                        esc_attr($width)
                    );
                }
                break;

            case 'button':
                $label = isset($content['label']) ? $content['label'] : 'Button';
                $url = isset($content['url']) ? $content['url'] : '#';
                $bg_color = isset($content['backgroundColor']) ? $content['backgroundColor'] : '#0073aa';
                $text_color = isset($content['color']) ? $content['color'] : '#ffffff';

                $styles = sprintf(
                    'display: inline-block; padding: 10px 20px; text-decoration: none; border-radius: 4px; background-color: %s; color: %s;',
                    esc_attr($bg_color),
                    esc_attr($text_color)
                );

                $html = sprintf(
                    '<div style="padding: 10px;"><a href="%s" style="%s">%s</a></div>',
                    esc_url($url),
                    $styles,
                    esc_html($label)
                );
                break;
        }

        return $html;
    }

    /**
     * Register the admin menu page.
     */
    public function register_menu_page()
    {
        $this->page_hook = add_menu_page(
            'Codera Builder',
            'Codera',
            'manage_options',
            'codera',
            array($this, 'render_admin_page'),
            'dashicons-layout',
            25
        );
    }

    /**
     * Render the React application container.
     */
    public function render_admin_page()
    {
        echo '<div id="codera-app">';
        echo '<div style="padding: 40px; text-align: center; color: #666; font-family: -apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, Oxygen-Sans, Ubuntu, Cantarell, \'Helvetica Neue\', sans-serif;">';
        echo '<h2 style="margin-bottom: 20px;">Loading Codera Page Builder...</h2>';
        echo '<div class="spinner is-active" style="float:none; margin: 0 auto 20px;"></div>';
        echo '<p>Please ensure the React development server is running (<code>npm run dev</code>) or the project has been built (<code>npm run build</code>).</p>';
        echo '</div>';
        echo '</div>';
    }

    /**
     * Add "Edit with Codera" link to post/page row actions.
     */
    public function add_row_actions($actions, $post)
    {
        if (current_user_can('edit_post', $post->ID)) {
            $url = admin_url('admin.php?page=codera&post_id=' . $post->ID);
            $actions['codera_edit'] = sprintf(
                '<a href="%s" aria-label="%s">%s</a>',
                esc_url($url),
                esc_attr__('Edit with Codera', 'codera'),
                esc_html__('Edit with Codera', 'codera')
            );
        }
        return $actions;
    }

    /**
     * Add Meta Box to the editor sidebar.
     */
    public function add_editor_meta_box()
    {
        $screens = array('post', 'page');
        foreach ($screens as $screen) {
            add_meta_box(
                'codera_open_builder',
                'Codera Page Builder',
                array($this, 'render_meta_box_content'),
                $screen,
                'side',
                'high'
            );
        }
    }

    /**
     * Render content for the editor meta box.
     */
    public function render_meta_box_content($post)
    {
        $url = admin_url('admin.php?page=codera&post_id=' . $post->ID);
        echo '<div style="text-align: center; padding: 10px 0;">';
        echo '<p style="margin-bottom: 12px;">' . esc_html__('Customize this content with the visual builder.', 'codera') . '</p>';
        echo sprintf(
            '<a href="%s" class="button button-primary components-button is-primary" style="display: block; width: 100%%; justify-content: center; height: 36px; line-height: 34px; font-size: 14px;">%s</a>',
            esc_url($url),
            esc_html__('Edit with Codera', 'codera')
        );
        echo '</div>';
    }

    /**
     * Add "Edit with Codera" button to the Admin Bar.
     */
    public function add_admin_bar_button($wp_admin_bar)
    {
        if (!is_admin() && !is_singular()) {
            return; // Only show on frontend single posts or admin
        }

        if (!current_user_can('edit_posts')) {
            return;
        }

        $post_id = 0;

        if (is_singular()) {
            $post_id = get_the_ID();
        } elseif (is_admin()) {
            $screen = get_current_screen();
            if ($screen && ('post' === $screen->base || 'page' === $screen->base) && isset($_GET['post'])) {
                $post_id = intval($_GET['post']);
            }
        }

        if ($post_id) {
            $url = admin_url('admin.php?page=codera&post_id=' . $post_id);
            $elements = get_post_meta($post_id, '_codera_layout', true);
            $is_active = !empty($elements) && is_array($elements);

            $title = '<span class="ab-icon dashicons dashicons-layout" style="margin-top: 2px;"></span> ' . esc_html__('Edit with Codera', 'codera');

            if ($is_active) {
                $title .= ' <span style="background: #2271b1; color: #fff; padding: 1px 6px; border-radius: 3px; font-size: 10px; vertical-align: top; margin-left: 5px;">ACTIVE</span>';
            }

            $wp_admin_bar->add_node(array(
                'id' => 'codera-edit',
                'title' => $title,
                'href' => $url,
                'meta' => array(
                    'class' => 'codera-edit-link',
                    'title' => esc_html__('Edit this post with Codera Page Builder', 'codera')
                )
            ));
        }
    }

    /**
     * Add "Codera" state to post list.
     */
    public function add_post_states($post_states, $post)
    {
        $elements = get_post_meta($post->ID, '_codera_layout', true);
        if (!empty($elements) && is_array($elements)) {
            $post_states['codera'] = __('Codera', 'codera');
        }
        return $post_states;
    }

    /**
     * Enqueue scripts and styles.
     */
    public function enqueue_scripts($hook)
    {
        if ($hook !== $this->page_hook) {
            return;
        }

        $post_id = isset($_GET['post_id']) ? intval($_GET['post_id']) : 0;

        $build_js_path = plugin_dir_path(__FILE__) . 'build/assets/main.js';
        $build_css_path = plugin_dir_path(__FILE__) . 'build/assets/main.css';
        $build_js_url = plugin_dir_url(__FILE__) . 'build/assets/main.js';
        $build_css_url = plugin_dir_url(__FILE__) . 'build/assets/main.css';

        if (file_exists($build_js_path)) {
            // Production
            wp_enqueue_script('codera-app', $build_js_url, array('wp-element', 'wp-i18n', 'wp-components'), '1.0.0', true);

            if (file_exists($build_css_path)) {
                wp_enqueue_style('codera-app-style', $build_css_url, array('wp-components'), '1.0.0');
            }
        } else {
            // Development (Vite HMR)
            wp_enqueue_script('codera-vite-client', 'http://localhost:5173/@vite/client', array(), null, true);

            add_filter('script_loader_tag', function ($tag, $handle, $src) {
                if ('codera-vite-client' === $handle || 'codera-app-dev' === $handle) {
                    return '<script type="module" src="' . esc_url($src) . '"></script>';
                }
                return $tag;
            }, 10, 3);

            wp_enqueue_script('codera-app-dev', 'http://localhost:5173/src/index.jsx', array('codera-vite-client', 'wp-element', 'wp-i18n', 'wp-components'), null, true);
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

    /**
     * Register REST API routes.
     */
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

    /**
     * Handle saving layout data.
     */
    public function handle_save_layout($request)
    {
        $params = $request->get_json_params();
        $post_id = isset($params['post_id']) ? intval($params['post_id']) : 0;
        $elements = isset($params['elements']) ? $params['elements'] : array();

        if ($post_id > 0) {
            update_post_meta($post_id, '_codera_layout', $elements);
            return new WP_REST_Response(array(
                'success' => true,
                'message' => 'Saved to Post Meta',
                'data' => $elements
            ), 200);
        } else {
            update_option('codera_default_layout', $elements);
            return new WP_REST_Response(array(
                'success' => true,
                'message' => 'Saved to Options (No Post ID provided)',
                'data' => $elements
            ), 200);
        }
    }

    /**
     * Handle loading layout data.
     */
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
