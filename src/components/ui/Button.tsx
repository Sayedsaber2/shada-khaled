import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/cn'
import { Magnetic } from './Magnetic'
import { TextRoll } from './TextRoll'

/* -------------------------------------------------------------------------- */
/*  <Button> — the pill. Renders an <a> when `href` is given, else a <button>. */
/*                                                                            */
/*  primary : paper fill, ink text   (the main call to action)                 */
/*  accent  : violet fill, white text                                          */
/*  ghost   : hairline outline                                                 */
/* -------------------------------------------------------------------------- */

type Variant = 'primary' | 'accent' | 'ghost'
type Size = 'md' | 'lg'

const base =
  'group inline-flex items-center justify-center gap-2.5 rounded-full font-semibold tracking-[-0.005em] whitespace-nowrap select-none transition-[background-color,border-color,color,transform,scale] duration-300 ease-soft active:scale-[0.97]'

const variants: Record<Variant, string> = {
  primary: 'bg-fg text-bg hover:bg-accent-strong',
  accent: 'bg-accent-fill text-white hover:bg-violet-700',
  ghost: 'border border-line-control text-fg hover:border-accent-strong hover:text-accent-strong',
}

const sizes: Record<Size, string> = {
  md: 'h-11 px-5 text-[0.875rem]',
  lg: 'h-[3.25rem] px-7 text-[0.9375rem]',
}

interface CommonProps {
  children: ReactNode
  variant?: Variant
  size?: Size
  /** Icon placed after the label (lucide icon element). */
  icon?: ReactNode
  /** Pull towards the cursor on desktop. */
  magnetic?: boolean
  className?: string
}

type ButtonAsButton = CommonProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'children'> & { href?: undefined }
type ButtonAsLink = CommonProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'className' | 'children'> & { href: string }

export function Button(props: ButtonAsButton | ButtonAsLink) {
  const { children, variant = 'primary', size = 'lg', icon, magnetic = false, className, ...rest } = props
  const classes = cn(base, variants[variant], sizes[size], className)

  const content = (
    <>
      <TextRoll>{children}</TextRoll>
      {icon ? (
        <span
          aria-hidden="true"
          className="inline-flex transition-transform duration-300 ease-out-expo group-hover:translate-x-0.5"
        >
          {icon}
        </span>
      ) : null}
    </>
  )

  const element =
    typeof rest.href === 'string' ? (
      <a className={classes} {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}>
        {content}
      </a>
    ) : (
      <button type="button" className={classes} {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}>
        {content}
      </button>
    )

  return magnetic ? <Magnetic>{element}</Magnetic> : element
}

/* -------------------------------------------------------------------------- */
/*  <ArrowLink> — inline text link with an underline that redraws on hover.    */
/* -------------------------------------------------------------------------- */

interface ArrowLinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'children'> {
  children: ReactNode
  icon?: ReactNode
}

export function ArrowLink({ children, icon, className, ...rest }: ArrowLinkProps) {
  return (
    <a
      className={cn(
        'group inline-flex items-center gap-1.5 font-medium text-fg transition-colors duration-300 hover:text-accent-strong',
        className,
      )}
      {...rest}
    >
      <span className="link-underline link-underline-on">{children}</span>
      {icon ? (
        <span
          aria-hidden="true"
          className="inline-flex transition-transform duration-300 ease-out-expo group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        >
          {icon}
        </span>
      ) : null}
    </a>
  )
}
