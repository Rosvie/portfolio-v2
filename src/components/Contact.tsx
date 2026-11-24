import { siGithub } from "simple-icons";

const contactLinks = [
  {
    label: "Email",
    detail: "pepitorosvie08@gmail.com",
    href: "mailto:pepitorosvie08@gmail.com",
    mark: "@",
    icon: null,
    className: "contact-mark-email",
  },
  {
    label: "LinkedIn",
    detail: "linkedin.com/in/rosviepepito",
    href: "https://www.linkedin.com/in/rosviepepito/",
    mark: null,
    icon: {
      viewBox: "0 0 448 512",
      path: "M416 32L31.9 32C14.3 32 0 46.5 0 64.3L0 447.7C0 465.5 14.3 480 31.9 480L416 480c17.6 0 32-14.5 32-32.3l0-383.4C448 46.5 433.6 32 416 32zM135.4 416l-66.4 0 0-213.8 66.5 0 0 213.8-.1 0zM102.2 96a38.5 38.5 0 1 1 0 77 38.5 38.5 0 1 1 0-77zM384.3 416l-66.4 0 0-104c0-24.8-.5-56.7-34.5-56.7-34.6 0-39.9 27-39.9 54.9l0 105.8-66.4 0 0-213.8 63.7 0 0 29.2 .9 0c8.9-16.8 30.6-34.5 62.9-34.5 67.2 0 79.7 44.3 79.7 101.9l0 117.2z",
    },
    className: "contact-mark-linkedin",
  },
  {
    label: "GitHub",
    detail: "github.com/rosvie",
    href: "https://github.com/rosvie",
    mark: null,
    icon: {
      viewBox: "0 0 24 24",
      path: siGithub.path,
    },
    className: "contact-mark-github",
  },
];

/** Provides direct email and social links. */
export default function Contact() {
  return (
    <section className="contact-section" id="contact">
      <div className="contact-copy">
        <h2 className="section-title">Let&apos;s Connect</h2>
        <p>Have a project, a role, or just a hello? My inbox is open.</p>
      </div>
      <ul className="contact-links">
        {contactLinks.map((link) => (
          <li className="contact-link-card" key={link.label}>
            <span className={`contact-mark ${link.className}`} aria-hidden="true">
              {link.icon ? (
                <svg viewBox={link.icon.viewBox} fill="currentColor">
                  <path d={link.icon.path} />
                </svg>
              ) : (
                link.mark
              )}
            </span>
            <span className="contact-link-copy">
              <span className="contact-link-label">{link.label}</span>
              <a
                href={link.href}
                target={link.label === "Email" ? undefined : "_blank"}
                rel={link.label === "Email" ? undefined : "noopener noreferrer"}
                data-sparkle-burst={link.label === "Email" ? true : undefined}
              >
                {link.detail}
              </a>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
