/**
 * Icon set, from Tabler (https://tabler.io/icons).
 *
 * Re-exported under semantic names so components ask for `BackIcon` rather
 * than a specific glyph, and swapping a glyph is a one-line change here.
 * Sizing comes from the button that holds them; only the stroke is pinned, at
 * a hair under Tabler's default so the icons sit quietly next to the type.
 */
import {
  IconArrowsDiagonalMinimize2,
  IconBrandGithub,
  IconBrandInstagram,
  IconBrandLinkedin,
  IconChevronLeft,
  IconDownload,
  IconExternalLink,
  IconMail,
  IconMessageCircle,
  IconTrophy,
  IconUser,
  IconX,
  type IconProps,
} from "@tabler/icons-react";

const STROKE = 1.6;

const withStroke =
  (Glyph: React.ComponentType<IconProps>) =>
  (props: IconProps) => <Glyph stroke={STROKE} {...props} />;

export const PersonIcon = withStroke(IconUser);
export const ChatIcon = withStroke(IconMessageCircle);
export const CloseIcon = withStroke(IconX);
export const BackIcon = withStroke(IconChevronLeft);
export const MailIcon = withStroke(IconMail);
export const ExternalIcon = withStroke(IconExternalLink);
export const CollapseIcon = withStroke(IconArrowsDiagonalMinimize2);
export const DownloadIcon = withStroke(IconDownload);
export const GithubIcon = withStroke(IconBrandGithub);
export const LinkedinIcon = withStroke(IconBrandLinkedin);
export const InstagramIcon = withStroke(IconBrandInstagram);

/** Tabler has no Devpost mark; a trophy reads correctly for hackathon entries. */
export const DevpostIcon = withStroke(IconTrophy);
