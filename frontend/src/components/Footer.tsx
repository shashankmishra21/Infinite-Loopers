import * as React from "react";
import { Github, Twitter, Linkedin, Instagram } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-black text-white mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
          <div className="flex flex-col items-center md:items-start">
            <div className="text-2xl font-semibold">GreenBridge</div>
            <p className="text-sm text-gray-300 mt-2 max-w-md text-center md:text-left">
              Connecting farmers to verified carbon credits through satellite monitoring and blockchain.
            </p>
          </div>

          <nav className="hidden md:flex gap-6">
            <a href="#" className="text-gray-300 hover:text-white">Home</a>
            <a href="#" className="text-gray-300 hover:text-white">Register</a>
            <a href="#" className="text-gray-300 hover:text-white">Dashboard</a>
            <a href="#" className="text-gray-300 hover:text-white">Marketplace</a>
            <a href="#" className="text-gray-300 hover:text-white">Contact</a>
          </nav>

          <div className="flex items-center gap-4">
            <a
              href="https://github.com/GreenBridge"
              aria-label="GitHub"
              target="_blank"
              rel="noreferrer"
              className="text-gray-300 hover:text-white"
            >
              <Github className="w-5 h-5" />
            </a>
            <a
              href="https://twitter.com/GreenBridge"
              aria-label="Twitter"
              target="_blank"
              rel="noreferrer"
              className="text-gray-300 hover:text-white"
            >
              <Twitter className="w-5 h-5" />
            </a>
            <a
              href="https://www.linkedin.com/company/greenbridge"
              aria-label="LinkedIn"
              target="_blank"
              rel="noreferrer"
              className="text-gray-300 hover:text-white"
            >
              <Linkedin className="w-5 h-5" />
            </a>
            <a
              href="https://www.instagram.com/GreenBridge"
              aria-label="Instagram"
              target="_blank"
              rel="noreferrer"
              className="text-gray-300 hover:text-white"
            >
              <Instagram className="w-5 h-5" />
            </a>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-6 text-center text-xs text-gray-400">
          © {new Date().getFullYear()} GreenBridge. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer;
