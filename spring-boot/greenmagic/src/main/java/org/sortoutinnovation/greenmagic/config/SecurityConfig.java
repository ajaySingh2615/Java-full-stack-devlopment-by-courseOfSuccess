package org.sortoutinnovation.greenmagic.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

/**
 * Spring Security Configuration
 * Configures authentication, authorization, password encoding, and CORS
 */
@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
public class SecurityConfig {

    /**
     * Password Encoder Bean - BCrypt with strength 12
     * BCrypt is the recommended password hashing algorithm for Spring Security
     * 
     * Strength levels:
     * - 10: Default (good for most applications)
     * - 12: High security (recommended for sensitive applications)
     * - 14: Very high security (slower but more secure)
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(12);
    }

    /**
     * Authentication Manager Bean
     * Required for custom authentication logic
     */
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    /**
     * Security Filter Chain Configuration
     * Defines which endpoints are protected and authentication requirements
     */
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            // Disable CSRF for REST API (stateless)
            .csrf(AbstractHttpConfigurer::disable)
            
            // Configure CORS
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            
            // Configure session management (stateless for REST API)
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            
            // Configure authorization rules
            .authorizeHttpRequests(authz -> authz
                // Public endpoints (no authentication required)
                .requestMatchers(
                    "/users/register",               // User registration
                    "/users/login",                  // User login (if implemented)
                    "/categories/**",                // Category browsing
                    "/products/**",                  // Product browsing
                    "/actuator/health",              // Health check
                    "/error"                         // Error handling
                ).permitAll()
                
                // Admin-only endpoints
                .requestMatchers(
                    "/admin/**",                     // Admin panel
                    "/users/*/delete",               // User deletion
                    "/actuator/**"                   // Actuator endpoints
                ).hasRole("ADMIN")
                
                // User-specific endpoints (require authentication)
                .requestMatchers(
                    "/users/profile",                // User profile
                    "/orders/**",                    // Order management
                    "/cart/**",                      // Cart operations
                    "/wishlist/**",                  // Wishlist operations
                    "/addresses/**"                  // Address management
                ).authenticated()
                
                // All other requests require authentication
                .anyRequest().authenticated()
            )
            
            // Disable HTTP Basic Authentication (was causing issues with public endpoints)
            // .httpBasic(basic -> basic.realmName("GreenMagic API"))
            
            // Disable form login (not needed for REST API)
            .formLogin(AbstractHttpConfigurer::disable)
            
            // Configure logout
            .logout(logout -> logout
                .logoutUrl("/api/logout")
                .logoutSuccessUrl("/api/login")
                .invalidateHttpSession(true)
                .deleteCookies("JSESSIONID")
            );

        return http.build();
    }

    /**
     * CORS Configuration
     * Allows cross-origin requests from frontend applications
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        
        // Allow specific origins (update for production)
        configuration.setAllowedOriginPatterns(Arrays.asList(
            "http://localhost:3000",     // React development server
            "http://localhost:4200",     // Angular development server
            "http://localhost:8080",     // Local development
            "https://yourdomain.com"     // Production domain
        ));
        
        // Allow specific HTTP methods
        configuration.setAllowedMethods(Arrays.asList(
            "GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"
        ));
        
        // Allow specific headers
        configuration.setAllowedHeaders(Arrays.asList(
            "Authorization", "Content-Type", "X-Requested-With", "Accept", "Origin"
        ));
        
        // Allow credentials (cookies, authorization headers)
        configuration.setAllowCredentials(true);
        
        // Cache preflight response for 1 hour
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
} 