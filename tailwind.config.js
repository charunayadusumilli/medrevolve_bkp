/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
  	extend: {
  		fontFamily: {
  			display: ['"Instrument Serif"', 'Georgia', 'serif'],
  			body: ['Inter', 'system-ui', 'sans-serif'],
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		colors: {
  			mr: {
  				cream: 'hsl(var(--mr-cream))',
  				ink: 'hsl(var(--mr-ink))',
  				forest: 'hsl(var(--mr-forest))',
  				sage: 'hsl(var(--mr-sage))',
  				sand: 'hsl(var(--mr-sand))',
  				blush: 'hsl(var(--mr-blush))',
  			},
  			dtc: {
  				page: 'hsl(var(--dtc-page))',
  				surface: 'hsl(var(--dtc-surface))',
  				text: 'hsl(var(--dtc-text))',
  			},
  			sf: {
  				paper: 'hsl(var(--sf-paper))',
  				surface: 'hsl(var(--sf-surface))',
  				ink: 'hsl(var(--sf-ink))',
  				muted: 'hsl(var(--sf-muted))',
  				line: 'hsl(var(--sf-line))',
  				accent: 'hsl(var(--sf-accent))',
  				'accent-soft': 'hsl(var(--sf-accent-soft))',
  				sun: 'hsl(var(--sf-sun))',
  				},
  				site: {
  				cream: 'hsl(var(--site-cream))',
  				surface: 'hsl(var(--site-surface))',
  				moss: 'hsl(var(--site-moss))',
  				rust: 'hsl(var(--site-rust))',
  				greige: 'hsl(var(--site-greige))',
  				line: 'hsl(var(--site-line))',
  				},
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			},
  			sidebar: {
  				DEFAULT: 'hsl(var(--sidebar-background))',
  				foreground: 'hsl(var(--sidebar-foreground))',
  				primary: 'hsl(var(--sidebar-primary))',
  				'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
  				accent: 'hsl(var(--sidebar-accent))',
  				'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
  				border: 'hsl(var(--sidebar-border))',
  				ring: 'hsl(var(--sidebar-ring))'
  			}
  		},
  		keyframes: {
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			}
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
}