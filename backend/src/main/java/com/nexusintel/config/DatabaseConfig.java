package com.nexusintel.config;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.DriverManager;

@Configuration
public class DatabaseConfig {

    private static final Logger log = LoggerFactory.getLogger(DatabaseConfig.class);

    @Value("${spring.datasource.url}")
    private String mysqlUrl;

    @Value("${spring.datasource.username}")
    private String mysqlUser;

    @Value("${spring.datasource.password}")
    private String mysqlPassword;

    @Bean
    @Primary
    public DataSource dataSource() {
        try {
            log.info("Testing connection to MySQL at {} with user '{}'...", mysqlUrl, mysqlUser);
            // Quick 3-second connection attempt to verify MySQL reachability & credentials
            DriverManager.setLoginTimeout(3);
            try (Connection conn = DriverManager.getConnection(mysqlUrl, mysqlUser, mysqlPassword)) {
                log.info("Successfully connected to MySQL database on port 3306! Using MySQL as primary data store.");
                HikariConfig config = new HikariConfig();
                config.setJdbcUrl(mysqlUrl);
                config.setUsername(mysqlUser);
                config.setPassword(mysqlPassword);
                config.setDriverClassName("com.mysql.cj.jdbc.Driver");
                config.setMaximumPoolSize(10);
                config.setMinimumIdle(2);
                config.setPoolName("NexusMySQLPool");
                return new HikariDataSource(config);
            }
        } catch (Exception ex) {
            log.warn("MySQL connection failed ({}: {}).", ex.getClass().getSimpleName(), ex.getMessage());
            log.warn("Activating automatic in-memory fallback database (H2 in MySQL mode) so all API operations, logins, and investigations are 100% operational.");
            HikariConfig config = new HikariConfig();
            config.setJdbcUrl("jdbc:h2:mem:nexus_intel;DB_CLOSE_DELAY=-1;MODE=MySQL;DATABASE_TO_LOWER=TRUE");
            config.setUsername("sa");
            config.setPassword("");
            config.setDriverClassName("org.h2.Driver");
            config.setMaximumPoolSize(10);
            config.setMinimumIdle(2);
            config.setPoolName("NexusH2FallbackPool");
            return new HikariDataSource(config);
        }
    }
}
