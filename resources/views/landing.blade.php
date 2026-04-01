<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Tahfiz Management System</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <style>
        :root {
            --blue: #2563eb;
            --blue-dark: #1d4ed8;
            --green: #16a34a;
            --green-dark: #15803d;
            --green-light: #bbf7d0;
            --slate-900: #0f172a;
            --slate-800: #1f2937;
            --slate-700: #374151;
            --slate-600: #4b5563;
            --slate-500: #6b7280;
            --slate-400: #9ca3af;
            --slate-100: #e5e7eb;
            --bg-right-from: #e6f7ef;
            --bg-right-to: #c9f0de;
        }

        * {
            box-sizing: border-box;
        }

        body {
            margin: 0;
            font-family: "Plus Jakarta Sans", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
            color: var(--slate-900);
            background: #ffffff;
        }

        a {
            text-decoration: none;
            color: inherit;
        }

        /* NAVBAR */
        .navbar {
            width: 100%;
            background: rgba(255, 255, 255, 0.9);
            backdrop-filter: blur(16px);
            border-bottom: 1px solid rgba(226, 232, 240, 0.8);
            position: sticky;
            top: 0;
            z-index: 30;
        }

        .navbar-inner {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 1rem;
            display: flex;
            align-items: center;
            justify-content: space-between;
            height: 72px;
        }

        .nav-logo {
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }

        .nav-logo-icon {
            height: 36px;
            width: 36px;
            border-radius: 14px;
            background: linear-gradient(135deg, #22c55e, #2563eb);
            display: flex;
            align-items: center;
            justify-content: center;
            color: #ffffff;
            font-weight: 600;
            font-size: 0.8rem;
            box-shadow: 0 8px 24px rgba(37, 99, 235, 0.4);
        }

        .nav-logo-text {
            font-size: 1.1rem;
            font-weight: 600;
            letter-spacing: -0.02em;
        }

        .nav-links {
            display: flex;
            align-items: center;
            gap: 2rem;
            font-size: 0.9rem;
            font-weight: 500;
            color: var(--slate-500);
        }

        .nav-links a {
            position: relative;
            padding-bottom: 2px;
            transition: color 0.18s ease;
        }

        .nav-links a::after {
            content: "";
            position: absolute;
            left: 0;
            right: 0;
            bottom: -4px;
            height: 2px;
            border-radius: 999px;
            background: var(--blue);
            transform: scaleX(0);
            transform-origin: center;
            transition: transform 0.2s ease;
        }

        .nav-links a:hover {
            color: var(--blue);
        }

        .nav-links a:hover::after {
            transform: scaleX(1);
        }

        .nav-actions {
            display: flex;
            align-items: center;
            gap: 0.75rem;
        }

        .btn-login {
            padding: 0.4rem 1.15rem;
            border-radius: 999px;
            background: var(--green-light);
            color: #166534;
            font-size: 0.85rem;
            font-weight: 500;
            border: none;
            cursor: pointer;
            transition: background 0.18s ease, transform 0.18s ease;
        }

        .btn-login:hover {
            background: #a7f3c7;
            transform: translateY(-1px);
        }

        .btn-signup {
            padding: 0.45rem 1.2rem;
            border-radius: 999px;
            background: var(--green);
            color: #ffffff;
            font-size: 0.9rem;
            font-weight: 600;
            border: none;
            cursor: pointer;
            box-shadow: 0 10px 24px rgba(22, 163, 74, 0.3);
            transition: background 0.18s ease, transform 0.18s ease, box-shadow 0.18s ease;
        }

        .btn-signup:hover {
            background: var(--green-dark);
            transform: translateY(-1px);
            box-shadow: 0 14px 32px rgba(22, 163, 74, 0.35);
        }

        /* HERO LAYOUT */
        .hero {
            position: relative;
            overflow: hidden;
            background: #ffffff;
        }

        .hero-inner {
            max-width: 1200px;
            margin: 0 auto;
            padding: 2.5rem 1rem 4rem;
            display: grid;
            grid-template-columns: minmax(0, 1.15fr) minmax(0, 0.85fr);
            gap: 3rem;
            align-items: center;
            position: relative;
            z-index: 1;
        }

        .hero-left {
            max-width: 580px;
        }

        .hero-badge {
            display: inline-flex;
            align-items: center;
            gap: 0.4rem;
            padding: 0.25rem 0.8rem;
            border-radius: 999px;
            background: rgba(37, 99, 235, 0.06);
            border: 1px solid rgba(37, 99, 235, 0.2);
        }

        .hero-badge-dot {
            width: 6px;
            height: 6px;
            border-radius: 999px;
            background: var(--blue);
        }

        .hero-badge-text {
            font-size: 0.7rem;
            text-transform: uppercase;
            letter-spacing: 0.14em;
            font-weight: 600;
            color: var(--blue);
        }

        .hero-title {
            margin: 1rem 0 0.75rem;
            font-size: 2.5rem;
            line-height: 1.1;
            font-weight: 800;
            color: var(--green);
            letter-spacing: -0.03em;
        }

        .hero-subtitle {
            font-size: 1rem;
            line-height: 1.7;
            color: var(--slate-600);
            max-width: 520px;
        }

        .hero-features {
            margin-top: 0.75rem;
            display: flex;
            flex-direction: column;
            gap: 0.75rem;
        }

        .feature-item {
            display: flex;
            align-items: flex-start;
            gap: 0.75rem;
        }

        .feature-icon {
            margin-top: 2px;
            height: 32px;
            width: 32px;
            border-radius: 12px;
            background: var(--blue);
            display: flex;
            align-items: center;
            justify-content: center;
            color: #ffffff;
            box-shadow: 0 10px 24px rgba(37, 99, 235, 0.35);
        }

        .feature-text {
            font-size: 0.95rem;
            font-weight: 500;
            color: var(--slate-800);
        }

        .hero-cta {
            margin-top: 1.4rem;
            display: flex;
            flex-wrap: wrap;
            gap: 0.7rem;
        }

        .btn-primary {
            padding: 0.7rem 1.6rem;
            border-radius: 999px;
            border: none;
            background: var(--blue);
            color: #ffffff;
            font-size: 0.95rem;
            font-weight: 600;
            cursor: pointer;
            box-shadow: 0 10px 24px rgba(37, 99, 235, 0.35);
            transition: background 0.18s ease, transform 0.18s ease, box-shadow 0.18s ease;
        }

        .btn-primary:hover {
            background: var(--blue-dark);
            transform: translateY(-1px);
            box-shadow: 0 14px 32px rgba(37, 99, 235, 0.4);
        }

        .btn-secondary {
            padding: 0.7rem 1.6rem;
            border-radius: 999px;
            border: 1.5px solid var(--blue);
            background: #ffffff;
            color: var(--blue);
            font-size: 0.95rem;
            font-weight: 600;
            cursor: pointer;
            transition: background 0.18s ease, color 0.18s ease;
        }

        .btn-secondary:hover {
            background: rgba(37, 99, 235, 0.04);
        }

        /* RIGHT VISUAL AREA */
        .hero-right {
            position: relative;
            height: 380px;
        }

        .hero-right-bg {
            position: absolute;
            inset: 0;
            right: -10px;
            border-radius: 40px;
            background: linear-gradient(145deg, var(--bg-right-from), var(--bg-right-to));
        }

        .hero-right-blob1,
        .hero-right-blob2 {
            position: absolute;
            border-radius: 999px;
            filter: blur(40px);
            pointer-events: none;
        }

        .hero-right-blob1 {
            right: -40px;
            top: -30px;
            width: 210px;
            height: 210px;
            background: rgba(74, 222, 128, 0.5);
        }

        .hero-right-blob2 {
            left: -30px;
            bottom: 0;
            width: 180px;
            height: 180px;
            background: rgba(45, 212, 191, 0.6);
        }

        .hero-main-image-wrap {
            position: absolute;
            left: 24px;
            right: 12px;
            top: 24px;
            bottom: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .hero-main-image-inner {
            position: relative;
            max-width: 260px;
            width: 100%;
        }

        .hero-main-image-glow {
            position: absolute;
            inset: -16px;
            border-radius: 32px;
            background: conic-gradient(
                from 220deg,
                rgba(22, 163, 74, 0.15),
                rgba(37, 99, 235, 0.12),
                rgba(16, 185, 129, 0.2)
            );
            filter: blur(18px);
        }

        .hero-main-image-card {
            position: relative;
            border-radius: 28px;
            overflow: hidden;
            background: rgba(15, 23, 42, 0.92);
            border: 1px solid rgba(15, 23, 42, 0.8);
            box-shadow: 0 26px 64px rgba(15, 23, 42, 0.8);
        }

        .hero-main-image-placeholder {
            height: 260px;
            background:
                radial-gradient(circle at top, #4ade80 0, #0369a1 60%, #020617 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
            color: #e5e7eb;
            padding: 1.2rem;
        }

        .hero-main-image-placeholder-title {
            margin-bottom: 0.4rem;
            font-size: 0.7rem;
            text-transform: uppercase;
            letter-spacing: 0.2em;
            color: rgba(190, 242, 100, 0.8);
        }

        .hero-main-image-placeholder-text {
            font-size: 0.95rem;
            font-weight: 600;
        }

        .hero-main-image-placeholder-highlight {
            color: #6ee7b7;
        }

        /* Glass widgets */
        .widget {
            position: absolute;
            border-radius: 18px;
            background: rgba(255, 255, 255, 0.9);
            border: 1px solid rgba(148, 163, 184, 0.25);
            box-shadow: 0 18px 45px rgba(15, 23, 42, 0.18);
            backdrop-filter: blur(18px);
            padding: 0.8rem;
            font-size: 0.7rem;
        }

        .widget-1 {
            top: -10px;
            left: 0;
            width: 210px;
            animation: float1 7s ease-in-out infinite;
        }

        .widget-2 {
            bottom: 10px;
            left: 8px;
            width: 210px;
            animation: float2 8.5s ease-in-out infinite;
        }

        .widget-3 {
            top: 70px;
            right: 0;
            width: 220px;
            animation: float3 9s ease-in-out infinite;
        }

        .widget-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 0.35rem;
        }

        .widget-title {
            font-weight: 600;
            font-size: 0.7rem;
            color: var(--slate-800);
        }

        .widget-chip {
            display: inline-flex;
            align-items: center;
            gap: 0.15rem;
            padding: 0.15rem 0.45rem;
            border-radius: 999px;
            background: #ecfdf5;
            color: #166534;
            font-size: 0.6rem;
            font-weight: 600;
        }

        .widget-chip-dot {
            width: 6px;
            height: 6px;
            border-radius: 999px;
            background: #22c55e;
        }

        .widget-subtext {
            font-size: 0.65rem;
            color: var(--slate-400);
            margin-bottom: 0.35rem;
        }

        .widget-bars {
            display: flex;
            align-items: flex-end;
            gap: 0.25rem;
            height: 56px;
        }

        .widget-bar-outer {
            flex: 1;
            border-radius: 999px;
            background: #dbeafe;
            overflow: hidden;
        }

        .widget-bar-inner {
            width: 100%;
            border-radius: 999px;
            background: var(--blue);
        }

        .widget2-row {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            margin-bottom: 0.3rem;
        }

        .widget2-avatar {
            height: 28px;
            width: 28px;
            border-radius: 999px;
            background: #dbeafe;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 0.65rem;
            font-weight: 600;
            color: var(--blue);
        }

        .widget2-name {
            font-size: 0.7rem;
            font-weight: 600;
            color: var(--slate-800);
        }

        .widget2-meta {
            font-size: 0.65rem;
            color: var(--slate-400);
        }

        .widget2-pill {
            display: inline-flex;
            align-items: center;
            gap: 0.25rem;
            padding: 0.15rem 0.4rem;
            border-radius: 999px;
            background: #ecfdf5;
            color: #166534;
            font-size: 0.65rem;
            font-weight: 500;
            margin-bottom: 0.25rem;
        }

        .widget-timestamp {
            font-size: 0.6rem;
            color: var(--slate-400);
        }

        .widget3-amount {
            font-size: 0.8rem;
            font-weight: 600;
            color: var(--slate-900);
        }

        .widget3-label {
            font-size: 0.7rem;
            font-weight: 500;
            color: var(--slate-700);
        }

        .widget3-meta {
            font-size: 0.6rem;
            color: var(--slate-400);
            margin-top: 0.1rem;
        }

        .icon-line {
            width: 12px;
            height: 12px;
            border-radius: 3px;
            border: 2px solid rgba(255, 255, 255, 0.9);
            border-bottom: none;
            border-right: none;
            transform: rotate(-45deg);
        }

        @keyframes float1 {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-6px); }
        }
        @keyframes float2 {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-5px); }
        }
        @keyframes float3 {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-7px); }
        }

        @media (max-width: 960px) {
            .navbar-inner {
                height: 64px;
            }
            .nav-links {
                display: none;
            }
            .nav-actions {
                display: none;
            }
            .hero-inner {
                grid-template-columns: minmax(0, 1fr);
                padding-top: 2rem;
                padding-bottom: 3rem;
            }
            .hero-right {
                margin-top: 1.5rem;
                height: 360px;
            }
            .hero-title {
                font-size: 2.2rem;
            }
        }

        /* AUTH CARD BELOW HERO */
        .auth-section {
            max-width: 1200px;
            margin: 0 auto 4rem;
            padding: 0 1rem;
        }

        .auth-card {
            margin-top: 2rem;
            border-radius: 32px;
            background: #ffffff;
            box-shadow: 0 24px 60px rgba(15, 23, 42, 0.10);
            display: grid;
            grid-template-columns: minmax(0, 1.1fr) minmax(0, 0.9fr);
            overflow: hidden;
        }

        .auth-card-left {
            padding: 2.5rem;
        }

        .auth-tabs {
            display: inline-flex;
            padding: 0.25rem;
            border-radius: 999px;
            background: #f1f5f9;
            margin-bottom: 1.5rem;
        }

        .auth-tab {
            border: none;
            background: transparent;
            padding: 0.5rem 1.2rem;
            border-radius: 999px;
            font-size: 0.85rem;
            font-weight: 600;
            color: var(--slate-500);
            cursor: pointer;
        }

        .auth-tab.active {
            background: #ffffff;
            color: var(--blue);
            box-shadow: 0 10px 25px rgba(15, 23, 42, 0.06);
        }

        .auth-title {
            font-size: 1.4rem;
            font-weight: 700;
            color: var(--slate-900);
            margin-bottom: 0.25rem;
        }

        .auth-subtitle {
            font-size: 0.9rem;
            color: var(--slate-500);
            margin-bottom: 1.5rem;
        }

        .auth-form {
            display: none;
        }

        .auth-form.active {
            display: block;
        }

        .form-grid {
            display: flex;
            flex-direction: column;
            gap: 0.9rem;
        }

        .form-label {
            font-size: 0.8rem;
            font-weight: 600;
            color: var(--slate-700);
            margin-bottom: 0.25rem;
        }

        .form-input,
        .form-select {
            width: 100%;
            padding: 0.75rem 0.9rem;
            border-radius: 0.9rem;
            border: 1px solid var(--slate-100);
            background: #f9fafb;
            font-size: 0.9rem;
            outline: none;
            transition: border-color 0.15s ease, box-shadow 0.15s ease, background-color 0.15s ease;
        }

        .form-input:focus,
        .form-select:focus {
            border-color: var(--blue);
            box-shadow: 0 0 0 1px rgba(37, 99, 235, 0.2);
            background: #ffffff;
        }

        .role-options {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 0.6rem;
            margin-bottom: 0.5rem;
        }

        .role-label {
            display: flex;
            align-items: center;
            padding: 0.7rem 0.8rem;
            border-radius: 0.9rem;
            background: #e2f3f2;
            border: 1px solid transparent;
            cursor: pointer;
            transition: background 0.15s ease, border-color 0.15s ease, transform 0.12s ease;
            font-size: 0.8rem;
        }

        .role-label span {
            margin-left: 0.4rem;
            color: #1f2937;
            font-weight: 500;
        }

        .role-radio {
            display: none;
        }

        .role-radio:checked + .role-label {
            background: #8dafb0;
            border-color: #ffffff;
            transform: translateY(-1px);
        }

        .auth-footer-text {
            margin-top: 1rem;
            font-size: 0.8rem;
            color: var(--slate-500);
            text-align: center;
        }

        .auth-footer-text a {
            color: var(--blue);
            font-weight: 600;
        }

        .auth-error {
            margin-top: 0.75rem;
            font-size: 0.8rem;
            color: #dc2626;
        }

        .auth-card-right {
            padding: 2.5rem;
            background: radial-gradient(circle at top left, #bbf7d0, #22c55e 40%, #14532d 100%);
            color: #ecfdf5;
            display: flex;
            flex-direction: column;
            justify-content: center;
        }

        .auth-right-title {
            font-size: 1.6rem;
            font-weight: 700;
            margin-bottom: 0.5rem;
        }

        .auth-right-text {
            font-size: 0.9rem;
            opacity: 0.9;
            margin-bottom: 1.2rem;
        }

        .auth-right-bullets {
            font-size: 0.85rem;
            list-style: none;
            padding-left: 0;
            margin: 0;
        }

        .auth-right-bullets li {
            display: flex;
            align-items: center;
            gap: 0.4rem;
            margin-bottom: 0.35rem;
        }

        .auth-right-bullets span {
            width: 18px;
            height: 18px;
            border-radius: 999px;
            border: 2px solid rgba(240, 253, 250, 0.7);
            display: inline-flex;
            align-items: center;
            justify-content: center;
            font-size: 0.65rem;
        }

        @media (max-width: 960px) {
            .navbar-inner {
                height: 64px;
            }
            .nav-links {
                display: none;
            }
            .nav-actions {
                display: none;
            }
            .hero-inner {
                grid-template-columns: minmax(0, 1fr);
                padding-top: 2rem;
                padding-bottom: 3rem;
            }
            .hero-right {
                margin-top: 1.5rem;
                height: 360px;
            }
            .hero-title {
                font-size: 2.2rem;
            }
            .auth-card {
                grid-template-columns: minmax(0, 1fr);
            }
            .auth-card-right {
                display: none;
            }
        }

        @media (max-width: 640px) {
            .hero-inner {
                padding-inline: 1rem;
            }
            .hero-title {
                font-size: 1.9rem;
            }
            .hero-subtitle {
                font-size: 0.95rem;
            }
            .hero-right {
                height: 340px;
            }
            .widget-1,
            .widget-2,
            .widget-3 {
                transform: scale(0.9);
            }
        }
    </style>
</head>
<body>
    <!-- NAVBAR -->
    <header class="navbar">
        <div class="navbar-inner">
            <div class="nav-logo">
                <div class="nav-logo-icon">AK</div>
                <span class="nav-logo-text">AKMAL Tahfiz</span>
            </div>

            <nav class="nav-links">
                <a href="#home">Home</a>
                <a href="#features">Features</a>
                <a href="#about">About</a>
                <a href="#contact">Contact</a>
            </nav>

            <div class="nav-actions">
                <a href="/app/role-selection" class="btn-login">Login</a>
                <a href="/app/role-selection?action=register" class="btn-signup">Sign Up</a>
            </div>
        </div>
    </header>

    <!-- HERO -->
    <section id="home" class="hero">
        <div class="hero-inner">
            <!-- LEFT -->
            <div class="hero-left">
                <div class="hero-badge">
                    <span class="hero-badge-dot"></span>
                    <span class="hero-badge-text">Powered by Modern Tech</span>
                </div>

                <h1 class="hero-title">Tahfiz Management System</h1>

                <p class="hero-subtitle">
                    A comprehensive digital platform for managing students, tracking memorization progress,
                    and administering tahfiz institutions more efficiently.
                </p>

                <div class="hero-features" id="features">
                    <div class="feature-item">
                        <div class="feature-icon">
                            <div class="icon-line"></div>
                        </div>
                        <div class="feature-text">Complete Student Management</div>
                    </div>

                    <div class="feature-item">
                        <div class="feature-icon">
                            <div class="icon-line"></div>
                        </div>
                        <div class="feature-text">Track Hafazan Progress</div>
                    </div>

                    <div class="feature-item">
                        <div class="feature-icon">
                            <div class="icon-line"></div>
                        </div>
                        <div class="feature-text">Systematic Fee Collection</div>
                    </div>
                </div>

                <div class="hero-cta">
                    <a href="#learn-more"><button class="btn-primary">Learn More</button></a>
                    <a href="#contact"><button class="btn-secondary">Contact Us</button></a>
                </div>
            </div>

            <!-- RIGHT -->
            <div class="hero-right">
                <div class="hero-right-bg"></div>
                <div class="hero-right-blob1"></div>
                <div class="hero-right-blob2"></div>

                <div class="hero-main-image-wrap">
                    <div class="hero-main-image-inner">
                        <div class="hero-main-image-glow"></div>
                        <div class="hero-main-image-card">
                            <!-- Replace this block with a real tahfiz-related photo -->
                            <div class="hero-main-image-placeholder">
                                <div>
                                    <div class="hero-main-image-placeholder-title">
                                        Tahfiz Environment
                                    </div>
                                    <div class="hero-main-image-placeholder-text">
                                        Replace this card with a<br>
                                        <span class="hero-main-image-placeholder-highlight">
                                            tahfiz-related image
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Widget 1: Memorization Progress -->
                <div class="widget widget-1">
                    <div class="widget-header">
                        <span class="widget-title">Memorization Progress</span>
                        <span class="widget-chip">82%</span>
                    </div>
                    <div class="widget-subtext">Class 5A • This week</div>
                    <div class="widget-bars">
                        <div class="widget-bar-outer">
                            <div class="widget-bar-inner" style="height:40%;"></div>
                        </div>
                        <div class="widget-bar-outer">
                            <div class="widget-bar-inner" style="height:50%;"></div>
                        </div>
                        <div class="widget-bar-outer">
                            <div class="widget-bar-inner" style="height:75%;"></div>
                        </div>
                        <div class="widget-bar-outer">
                            <div class="widget-bar-inner" style="height:85%;"></div>
                        </div>
                        <div class="widget-bar-outer">
                            <div class="widget-bar-inner" style="height:95%; background:#1d4ed8;"></div>
                        </div>
                    </div>
                </div>

                <!-- Widget 2: Attendance -->
                <div class="widget widget-2">
                    <div class="widget2-row">
                        <div class="widget2-avatar">AZ</div>
                        <div>
                            <div class="widget2-name">Ahmad Zulkifli</div>
                            <div class="widget2-meta">Tahfiz Junior • 5A</div>
                        </div>
                    </div>
                    <div class="widget2-pill">
                        <span style="width:10px;height:10px;border-radius:999px;border:2px solid #16a34a;border-top:none;border-left:none;transform:rotate(45deg);display:inline-block;"></span>
                        Attendance Marked
                    </div>
                    <div class="widget-timestamp">Today • 07:45 AM</div>
                </div>

                <!-- Widget 3: Yuran Dibayar -->
                <div class="widget widget-3">
                    <div class="widget-header">
                        <span class="widget-title">Yuran Dibayar</span>
                        <span class="widget-chip">
                            <span class="widget-chip-dot"></span>
                            Paid
                        </span>
                    </div>
                    <div>
                        <div class="widget3-label">Nur Aisyah</div>
                        <div class="widget3-amount">RM 150.00</div>
                        <div class="widget3-meta">February • 2026 • Monthly Fee</div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- AUTH CARD SECTION -->
    <section class="auth-section" id="auth">
        <div class="auth-card">
            <div class="auth-card-left">
                <div class="auth-title">Access your Tahfiz account</div>
                <div class="auth-subtitle">Select your role and sign in or register through our secure portal.</div>

                <div class="form-grid" style="margin-top: 1.5rem;">
                    <a href="/app/role-selection" style="display: block;">
                        <button type="button" class="btn-primary" style="width: 100%; font-size: 0.95rem; padding: 0.8rem 1.6rem;">
                            🔐 Login to your account
                        </button>
                    </a>
                    <a href="/app/role-selection?action=register" style="display: block;">
                        <button type="button" class="btn-secondary" style="width: 100%; font-size: 0.95rem; padding: 0.8rem 1.6rem;">
                            ✨ Create a new account
                        </button>
                    </a>
                    <div class="auth-footer-text">
                        You'll be asked to select your role (Admin, Teacher, Parent, or Student) before signing in.
                    </div>
                </div>
            </div>

            <div class="auth-card-right">
                <div class="auth-right-title">One login for every role</div>
                <div class="auth-right-text">
                    Admins, teachers, parents, and students all sign in through the same secure portal,
                    powered by the Tahfiz Management System.
                </div>
                <ul class="auth-right-bullets">
                    <li><span>✓</span> Centralized authentication</li>
                    <li><span>✓</span> Role-based access control</li>
                    <li><span>✓</span> Secure student and hafazan data</li>
                </ul>
            </div>
        </div>
    </section>

    <script>
        function switchAuthTab(targetId) {
            const tabs = document.querySelectorAll('.auth-tab');
            const forms = document.querySelectorAll('.auth-form');

            tabs.forEach(tab => {
                tab.classList.toggle('active', tab.dataset.target === targetId);
            });

            forms.forEach(form => {
                form.classList.toggle('active', form.id === targetId);
            });
        }

        document.querySelectorAll('.auth-tab').forEach(tab => {
            tab.addEventListener('click', () => switchAuthTab(tab.dataset.target));
        });
    </script>
</body>
</html>

