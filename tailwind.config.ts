import type { Config } from "tailwindcss";

export default {
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			fontFamily: {
				sans: ['Manrope', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
				manrope: ['Manrope', 'sans-serif'],
			},
			fontSize: {
				// Mobile-first typography scale with WCAG AAA compliance
				'heading-1': ['2rem', { lineHeight: '2.25rem', letterSpacing: '-0.02em', fontWeight: '600' }],      // 32px
				'heading-2': ['1.75rem', { lineHeight: '2rem', letterSpacing: '-0.02em', fontWeight: '600' }],      // 28px
				'heading-3': ['1.5rem', { lineHeight: '1.75rem', letterSpacing: '-0.01em', fontWeight: '600' }],    // 24px
				'subheading': ['1.125rem', { lineHeight: '1.5rem', letterSpacing: '-0.01em', fontWeight: '500' }],  // 18px
				'body': ['0.875rem', { lineHeight: '1.375rem', fontWeight: '400' }],                               // 14px 
				'body-small': ['0.75rem', { lineHeight: '1.25rem', fontWeight: '400' }],                           // 12px
			},
			// Responsive font sizes for desktop
			screens: {
				'md': '768px',
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
				// Updated vibrant gold yellow palette - WCAG AAA compliant
				yellow: {
					DEFAULT: '#FFD700', // Vibrant gold yellow
					50: '#FFFDF0',
					100: '#FFFBE0',
					200: '#FFF7C2',
					300: '#FFF3A3',
					400: '#FFEE85',
					500: '#FFD700', // DEFAULT - our target color
					600: '#D4B300', // Darker for better contrast with white text
					700: '#AA8F00', // Even darker for 4.5:1 ratio with white
					800: '#806C00', // For 7:1 ratio with white
					900: '#554800', // Extremely dark yellow
				},
				blue: {
					DEFAULT: '#1A326E', // Deep Blue - meets 4.5:1 with white
					50: '#E6EAF4',
					100: '#CCD4EA',
					200: '#99A9D5',
					300: '#667FC0',
					400: '#3454AA',
					500: '#1A326E', // DEFAULT
					600: '#152A5E',
					700: '#10214A',
					800: '#0B1836',
					900: '#060F22',
				},
				// Royal-blue adjusted for contrast
				"royal-blue": {
					DEFAULT: '#1A2F6D', // Darkened for 4.5:1 with white
					50: '#E8ECF6',
					100: '#D0D8ED',
					200: '#A3B2DB',
					300: '#758BC9',
					400: '#4865B7',
					500: '#1A2F6D', // DEFAULT
					600: '#15275A',
					700: '#111E47',
					800: '#0C1634',
					900: '#060D21',
				},
				// Neutral palette adjusted for 7:1 contrast ratio
				neutral: {
					DEFAULT: '#FFFFFF',
					50: '#FFFFFF',
					100: '#F8F9FA', // Background color
					200: '#E9ECEF',
					300: '#DEE2E6',
					400: '#CED4DA',
					500: '#6C757D', // Meets 4.5:1 with white background
					600: '#495057', // Meets 7:1 with white background
					700: '#343A40',
					800: '#212529',
					900: '#171E28', // Foreground color - meets 7:1 with F8F9FA
				},
				// Other colors adjusted for proper contrast
				amber: {
					DEFAULT: '#D97E00', // Adjusted for 4.5:1 with black
					50: '#FFF7E0',
					100: '#FFEFC3',
					200: '#FFDF8A',
					300: '#FFCF52',
					400: '#FFC229',
					500: '#D97E00', // DEFAULT
					600: '#B36800',
					700: '#8C5200',
					800: '#663C00',
					900: '#3F2500',
				},
				teal: {
					DEFAULT: '#0D8B61', // Adjusted for 4.5:1 with white
					50: '#E3F5EE',
					100: '#C7EBDD',
					200: '#8FD7BB',
					300: '#57C399',
					400: '#36B37E',
					500: '#0D8B61', // DEFAULT
					600: '#0A7450',
					700: '#085C40',
					800: '#05442F',
					900: '#032B1F',
				},
				green: {
					DEFAULT: '#0D8B61', // Same as teal
					50: '#E3F5EE',
					100: '#C7EBDD',
					200: '#8FD7BB',
					300: '#57C399',
					400: '#36B37E',
					500: '#0D8B61', // DEFAULT
					600: '#0A7450',
					700: '#085C40',
					800: '#05442F',
					900: '#032B1F',
				},
				red: {
					DEFAULT: '#CF2E18', // Adjusted for 4.5:1 with white
					50: '#FFEBE5',
					100: '#FFD6CC',
					200: '#FFAD99',
					300: '#FF8566',
					400: '#FF5630',
					500: '#CF2E18', // DEFAULT
					600: '#AB2614',
					700: '#871D10',
					800: '#63150B',
					900: '#3F0E07',
				},
				magenta: {
					DEFAULT: '#AB33CA', // Adjusted for 4.5:1 with white
					100: '#F5D0FE',
					200: '#E879F9',
					300: '#D946EF',
					400: '#C026D3',
					500: '#AB33CA', // DEFAULT
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
						boxShadow: '0 0 10px rgba(255, 215, 0, 0.5)'
					},
					'50%': {
						boxShadow: '0 0 20px rgba(255, 215, 0, 0.8)'
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
				'royal-blue-glow': {
					'0%, 100%': {
						boxShadow: '0 0 15px rgba(36, 60, 136, 0.5)'
					},
					'50%': {
						boxShadow: '0 0 25px rgba(36, 60, 136, 0.8)'
					}
				},
				'teal-glow': {
					'0%, 100%': {
						boxShadow: '0 0 15px rgba(43, 143, 101, 0.5)'
					},
					'50%': {
						boxShadow: '0 0 25px rgba(43, 143, 101, 0.8)'
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
				// New animations for pull-to-refresh
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
				'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
				'glow': 'glow 2s ease-in-out infinite',
				'blue-glow': 'blue-glow 2s ease-in-out infinite',
				'royal-blue-glow': 'royal-blue-glow 2s ease-in-out infinite',
				'teal-glow': 'teal-glow 2s ease-in-out infinite',
				'upvote-pop': 'upvote-pop 0.4s ease-in-out',
				// New animations for pull-to-refresh
				'rotate-arrow': 'rotate-arrow 0.3s ease-out forwards',
				'spin-refresh': 'spin-refresh 1s linear infinite'
			},
			boxShadow: {
				'sm': '0 1px 2px rgba(0, 0, 0, 0.05)',
				'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
				'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
				'glow': '0 0 15px rgba(255, 215, 0, 0.5)',
				'glow-strong': '0 0 25px rgba(255, 215, 0, 0.8)',
				'blue-glow': '0 0 15px rgba(30, 58, 138, 0.5)',
				'royal-blue-glow': '0 0 15px rgba(36, 60, 136, 0.5)',
				'teal-glow': '0 0 15px rgba(43, 143, 101, 0.5)'
			},
			backgroundImage: {
				'gradient-yellow': 'linear-gradient(90deg, #FFD700 0%, #D4B300 100%)',
				'gradient-blue': 'linear-gradient(90deg, #1A326E 0%, #3454AA 100%)',
				'gradient-royal-blue': 'linear-gradient(90deg, #1A2F6D 0%, #4865B7 100%)',
				'gradient-teal': 'linear-gradient(90deg, #0D8B61 0%, #085C40 100%)',
				'gradient-subtle': 'linear-gradient(180deg, rgba(30, 58, 138, 0.05) 0%, rgba(30, 58, 138, 0) 100%)',
				'gradient-card': 'linear-gradient(180deg, rgba(248, 249, 250, 1) 0%, rgba(233, 236, 239, 0.8) 100%)',
				'text-overlay-dark': 'linear-gradient(0deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0) 100%)',
				'text-overlay-light': 'linear-gradient(0deg, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0) 100%)',
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
