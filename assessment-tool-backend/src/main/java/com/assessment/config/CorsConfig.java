package com.assessment.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

@Configuration
public class CorsConfig {

	@Bean
	public CorsFilter corsFilter() {
	    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
	    CorsConfiguration config = new CorsConfiguration();
	    
	    // Allow specific origins or patterns
	    config.addAllowedOriginPattern("*");  // For development only
	    // config.addAllowedOrigin("http://localhost:3000"); // For production
	    
	    config.addAllowedMethod("*");
	    config.addAllowedHeader("*");
	    config.setAllowCredentials(true);
	    config.setMaxAge(3600L);
	    
	    source.registerCorsConfiguration("/**", config);
	    return new CorsFilter(source);
	}
}