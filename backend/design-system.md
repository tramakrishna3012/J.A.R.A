# Design System Documentation: J.A.R.A (Elite AI Job Agent)

This document outlines the visual language and architectural patterns derived from the J.A.R.A. web application interface.

---

## 1. Core Principles
*   **Futuristic Cyber-Minimalism**: The design leverages a deep, dark palette with high-contrast neon accents to evoke a sense of advanced technology and artificial intelligence.
*   **High-Tech Precision**: Use of geometric typography (`Space Grotesk`) and subtle motion (floating/pulsing) suggests a sophisticated, "living" software agent.
*   **Premium Depth**: Employs radial gradients and layered backgrounds to create visual interest without cluttering the interface.

## 2. Color Palette

### Base Colors
| Role | Hex Code | Tailwind Class | Usage |
| :--- | :--- | :--- | :--- |
| **Night** | `#05070A` | `bg-night` | Primary page background. |
| **Obsidian** | `#0B0F19` | `bg-obsidian` | Secondary backgrounds, cards, and section offsets. |
| **Slate Text** | `#E2E8F0` | `text-slate-200` | Primary body text and headings. |

### Accent Colors
| Role | Hex Code | Tailwind Class | Usage |
| :--- | :--- | :--- | :--- |
| **Electric** | `#6366F1` | `text-electric` | Primary brand color, buttons, and glow effects. |
| **Neon** | `#00F5FF` | `text-neon` | Secondary highlights, status indicators, and call-to-actions. |

## 3. Typography
*   **Primary Font**: `Space Grotesk` (Sans-serif).
*   **Characteristics**: Geometric, wide apertures, and a technical feel.
*   **Scale**:
    *   **Headings**: Bold weights (600-700), tight tracking.
    *   **Body**: Regular weights (400), increased line-height for readability against dark backgrounds.
    *   **Navigation/Labels**: Medium weights (500) with uppercase or specialized letter spacing.

## 4. Spacing & Layout
*   **Grid System**: Standard Tailwind 12-column grid logic.
*   **Container**: Max-width constraints used to maintain readability on ultra-wide displays.
*   **Padding/Margins**: Generous vertical spacing between sections to allow the "dark mode" aesthetic to breathe.
*   **Special Layouts**: Use of `flex` for navigation and hero alignment.

## 5. Components

### Buttons
*   **Primary Variant**: Solid `electric` background or heavy border with high-contrast text.
*   **Secondary/Ghost**: Transparent background with thin borders or subtle hover transitions.
*   **Interactions**: Smooth transitions on hover, often involving opacity changes or slight scaling.

### Containers & Cards
*   **Premium Gradient**: A custom class (`.premium-gradient`) utilizing radial gradients (e.g., `rgba(99, 102, 241, 0.15)`) to create a "glow" from the top-right corner.
*   **Glassmorphism**: Subtle use of background transparency and blurs to separate layers.

### Navigation
*   **Sticky Header**: Likely fixed or sticky with a backdrop-blur effect.
*   **Links**: Minimalist text links with `electric` or `neon` hover states.

## 6. Iconography & Motion
*   **Icon Style**: Likely thin-stroke, monolinear icons (consistent with Lucide or Heroicons).
*   **Animations**:
    *   `pulse-slow`: A 6-second subtle breathing effect for background elements.
    *   `float`: A 3-second vertical translation (`translateY`) to give elements a weightless, AI-driven feel.

---

## Reference HTML

```html
<!DOCTYPE html>
<html lang="en" class="scroll-smooth">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>J.A.R.A | Elite AI Job Agent</title>
    <!-- Google Fonts: Space Grotesk -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <!-- Tailwind CSS -->
    <script src="https://cdn.tailwindcss.com"></script>
    <!-- Alpine.js -->
    <script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    fontFamily: {
                        sans: ['Space Grotesk', 'sans-serif'],
                    },
                    colors: {
                        night: '#05070A',
                        obsidian: '#0B0F19',
                        electric: '#6366F1',
                        neon: '#00F5FF',
                    },
                    animation: {
                        'pulse-slow': 'pulse 6s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                        'float': 'float 3s ease-in-out infinite',
                    },
                    keyframes: {
                        float: {
                            '0%, 100%': { transform: 'translateY(0)' },
                            '50%': { transform: 'translateY(-10px)' },
                        }
                    }
                }
            }
        }
    </script>
    <style>
        [x-cloak] { display: none !important; }
        
        body {
            background-color: #05070A;
            color: #E2E8F0;
            overflow-x: hidden;
        }

        .premium-gradient {
            background: radial-gradient(circle at top right, rgba(99, 102, 241, 0.15), transparent),
                        radial-gradient(
```