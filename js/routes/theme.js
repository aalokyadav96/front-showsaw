const THEME = ` <!-- 🌙 Theme Toggle Button -->
    <button id="theme-toggle" class="theme-toggle">Toggle Theme</button>

    <!-- 📜 Main Content -->
    <main>
        <h1>Welcome to My Themed Website</h1>
        <p>This page supports dark mode, custom themes, and all responsive breakpoints.</p>
        
        <button>Click Me</button>
    </main>

    <!-- 🔀 JavaScript for Theme Switching -->
    <script>
        document.getElementById('theme-toggle').addEventListener('click', function () {
            let currentTheme = document.documentElement.getAttribute('data-theme');

            if (!currentTheme || currentTheme === 'light') {
                document.documentElement.setAttribute('data-theme', 'dark');
            } else if (currentTheme === 'dark') {
                document.documentElement.setAttribute('data-theme', 'sepia');
            } else if (currentTheme === 'sepia') {
                document.documentElement.setAttribute('data-theme', 'high-contrast');
            } else {
                document.documentElement.setAttribute('data-theme', 'light');
            }
        });
    </script>
`;

export {THEME};