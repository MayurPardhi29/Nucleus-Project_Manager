package com.mayur.nucleusbackend.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Contact;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.info.License;
import org.springframework.context.annotation.Configuration;

@Configuration
@OpenAPIDefinition(
        info = @Info(
                title = "Nucleus API",
                version = "1.0.0",
                description = "API documentation for Nucleus Backend. Auto-generated for frontend type safety.",
//                contact = @Contact(
//                        name = "MyApp Support",
//                        email = "support@myapp.com",
//                        url = "https://myapp.com"
//                ),
                license = @License(
                        name = "Apache 2.0",
                        url = "https://www.apache.org/licenses/LICENSE-2.0.html"
                )
        )
)

public class SwaggerConfig {
    // No additional beans needed — SpringDoc auto-configures everything
}
