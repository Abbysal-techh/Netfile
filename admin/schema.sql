CREATE DATABASE IF NOT EXISTS simple_admin
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE simple_admin;

CREATE TABLE users (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(190) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('admin', 'user') NOT NULL DEFAULT 'user',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE orders (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNSIGNED NOT NULL,
    order_no VARCHAR(30) NOT NULL UNIQUE,
    product_name VARCHAR(150) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    status ENUM('pending', 'processing', 'completed', 'cancelled')
        NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_orders_user_id (user_id),
    CONSTRAINT fk_orders_user
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE questions (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNSIGNED NOT NULL,
    subject VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    status ENUM('open', 'answered', 'closed') NOT NULL DEFAULT 'open',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_questions_user_id (user_id),
    CONSTRAINT fk_questions_user
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
) ENGINE=InnoDB;

-- Örnek şifreler:
-- admin@site.com / Admin123!
-- kullanici@site.com / User123!
INSERT INTO users (name, email, password_hash, role) VALUES
('Site Yöneticisi', 'admin@site.com', '$2y$10$llf6P2UFDJwFC/kBeCDn3eOZOgsyMBBluLLYMxiLZf/dsVwqeC1eC', 'admin'),
('Ayşe Yılmaz', 'kullanici@site.com', '$2y$10$./P.JCGvvcwfCUcrM3KP6uYq318aiXyX1SiWg2/b7HSadykpdbkuO', 'user');

INSERT INTO orders (user_id, order_no, product_name, amount, status) VALUES
((SELECT id FROM users WHERE email = 'kullanici@site.com'), 'SIP-2026-001', 'Balkon Güvenlik Filesi', 2450.00, 'processing'),
((SELECT id FROM users WHERE email = 'kullanici@site.com'), 'SIP-2026-002', 'Kedi Güvenlik Filesi', 1850.00, 'completed');

INSERT INTO questions (user_id, subject, message, status) VALUES
((SELECT id FROM users WHERE email = 'kullanici@site.com'), 'Montaj süresi hakkında', 'Siparişim için tahmini montaj tarihi nedir?', 'open'),
((SELECT id FROM users WHERE email = 'kullanici@site.com'), 'Garanti kapsamı', 'Ürünlerin garanti süresi hakkında bilgi alabilir miyim?', 'answered');

