
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./src/**/*.{ts,tsx}",
		"./index.html",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: {
				DEFAULT: '1rem',
				sm: '1.5rem',
				lg: '2rem'
			},
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			fontFamily: {
				sans: ["system-ui", "-apple-system", "BlinkMacSystemFont", '"Segoe UI"', "sans-serif"],
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				// Key brand colors with optimized shades
				yellow: {
					DEFAULT: '#FCF050', // Primary - Warm Yellow
					100: '#FFFDE0',
					200: '#FEF9C0',
					300: '#FDF6A0',
					400: '#FCF380',
					500: '#FCF050',
					600: '#F8E820',
					700: '#D6C708',
					800: '#A69A06',
					900: '#766E04',
				},
				blue: {
					DEFAULT: '#1E3A8A', // Accent - Deep Blue
					100: '#CCD4EA',
					200: '#99A9D5',
					300: '#667FC0',
					400: '#3454AA',
					500: '#1E3A8A',
					600: '#18307A',
					700: '#122563',
					800: '#0C1A4C',
					900: '#060F35',
				},
				teal: {
					DEFAULT: '#36B37E',
					100: '#C7EBDD',
					200: '#8FD7BB',
					300: '#57C399',
					400: '#36B37E',
					500: '#2B8F65',
					600: '#206B4B',
					700: '#164732',
					800: '#0B2419',
					900: '#051209',
				},
				amber: {
					DEFAULT: '#FFB800',
					200: '#FFDF8A',
					300: '#FFCF52',
					400: '#FFC229',
					500: '#FFB800',
					600: '#D99C00',
					700: '#B38000',
				},
				red: {
					DEFAULT: '#FF5630',
					100: '#FFD6CC',
					200: '#FFAD99',
					300: '#FF8566',
					400: '#FF5630',
					500: '#E6331B',
					600: '#B22815',
					700: '#7F1C0F',
				},
				neutral: {
					DEFAULT: '#FFFFFF',
					50: '#FFFFFF',
					100: '#F9FAFB',
					200: '#E5E7EB',
					300: '#D1D5DB',
					400: '#9CA3AF',
					500: '#6B7280',
					600: '#4B5563',
					700: '#374151',
					800: '#1F2937',
					900: '#111827',
				},
				// Manager posts color in separate section
				"royal-blue": {
					DEFAULT: '#243C88',
					100: '#D0D8ED',
					200: '#A3B2DB',
					300: '#758BC9',
					400: '#4865B7',
					500: '#243C88',
					600: '#1D3270',
					700: '#162758',
					800: '#0F1C40',
					900: '#081128',
				},
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' }
				},
				'fade-in': {
					'0%': {
						opacity: '0',
						transform: 'translateY(8px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)'
					}
				},
				'fade-out': {
					'0%': {
						opacity: '1',
						transform: 'translateY(0)'
					},
					'100%': {
						opacity: '0',
						transform: 'translateY(8px)'
					}
				},
				'pulse': {
					'0%, 100%': {
						opacity: '1',
					},
					'50%': {
						opacity: '0.5',
					},
				},
				'glow': {
					'0%, 100%': {
						boxShadow: '0 0 10px rgba(252, 240, 80, 0.5)'
					},
					'50%': {
						boxShadow: '0 0 20px rgba(252, 240, 80, 0.8)'
					}
				},
				'blue-glow': {
					'0%, 100%': {
						boxShadow: '0 0 15px rgba(30, 58, 138, 0.5)'
					},
					'50%': {
						boxShadow: '0 0 25px rgba(30, 58, 138, 0.8)'
					}
				},
				'upvote-pop': {
					'0%': {
						transform: 'translateY(0) scale(1)'
					},
					'50%': {
						transform: 'translateY(-5px) scale(1.1)'
					},
					'75%': {
						transform: 'translateY(-2px) scale(1.05)'
					},
					'100%': {
						transform: 'translateY(0) scale(1)'
					}
				},
				'rotate-arrow': {
					'0%': {
						transform: 'rotate(0deg)'
					},
					'100%': {
						transform: 'rotate(180deg)'
					}
				},
				'spin-refresh': {
					'0%': {
						transform: 'rotate(0deg)'
					},
					'100%': {
						transform: 'rotate(360deg)'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.3s ease-out',
				'fade-out': 'fade-out 0.3s ease-out',
				'pulse': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite', // Changed from 2s to 3s
				'glow': 'glow 2s ease-in-out infinite',
				'blue-glow': 'blue-glow 2s ease-in-out infinite',
				'upvote-pop': 'upvote-pop 0.4s ease-in-out',
				'rotate-arrow': 'rotate-arrow 0.3s ease-out forwards',
				'spin-refresh': 'spin-refresh 1s linear infinite'
			},
			boxShadow: {
				'sm': '0 1px 2px rgba(0, 0, 0, 0.05)',
				'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
				'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
				'glow': '0 0 15px rgba(252, 240, 80, 0.5)',
				'blue-glow': '0 0 15px rgba(30, 58, 138, 0.5)',
			},
			backgroundImage: {
				'gradient-yellow': 'linear-gradient(90deg, #FCF050 0%, #F8E820 100%)',
				'gradient-blue': 'linear-gradient(90deg, #1E3A8A 0%, #3454AA 100%)',
				'gradient-royal-blue': 'linear-gradient(90deg, #243C88 0%, #4865B7 100%)',
				'gradient-teal': 'linear-gradient(90deg, #36B37E 0%, #2B8F65 100%)',
				'gradient-subtle': 'linear-gradient(180deg, rgba(30, 58, 138, 0.05) 0%, rgba(30, 58, 138, 0) 100%)',
				'gradient-card': 'linear-gradient(180deg, rgba(249, 250, 251, 1) 0%, rgba(237, 242, 247, 0.8) 100%)',
			},
			spacing: {
				'touch': '44px', // Minimum touch target size
			},
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
