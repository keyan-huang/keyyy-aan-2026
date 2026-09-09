'use client';

import './contact-menu.css';

import site from '@/public/content/site.json';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function ContactMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="nav-contact">Contact</DropdownMenuTrigger>
      <DropdownMenuContent align="end" sideOffset={14} className="contact-menu">
        <DropdownMenuItem
          className="contact-menu-item"
          render={
            <a href={`mailto:${site.contact.email}`} aria-label="Email Keyan" />
          }
        >
          <span
            className="contact-color contact-color-email"
            aria-hidden="true"
          >
            E
          </span>
          <span>
            <strong>Email me</strong>
            <small>{site.contact.email}</small>
          </span>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="contact-menu-item"
          render={
            <a
              href={site.contact.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Visit Keyan's LinkedIn profile"
            />
          }
        >
          <span
            className="contact-color contact-color-linkedin"
            aria-hidden="true"
          >
            in
          </span>
          <span>
            <strong>LinkedIn</strong>
            <small>Connect professionally</small>
          </span>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="contact-menu-item contact-menu-item-disabled"
          disabled={!site.contact.resumeAvailable}
        >
          <span
            className="contact-color contact-color-resume"
            aria-hidden="true"
          >
            R
          </span>
          <span>
            <strong>Resume</strong>
            <small>Coming soon</small>
          </span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
