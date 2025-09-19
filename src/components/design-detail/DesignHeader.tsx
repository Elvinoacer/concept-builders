"use client";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function DesignHeader() {
  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex items-center justify-between whitespace-nowrap border-b border-solid border-gray-200 px-10 py-4 shadow-sm"
    >
      <div className="flex items-center gap-10">
        <div className="flex items-center gap-3 text-gray-900">
          <svg
            className="h-8 w-8 text-[var(--primary-color)]"
            fill="none"
            viewBox="0 0 48 48"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clipPath="url(#clip0_6_319)">
              <path
                d="M8.57829 8.57829C5.52816 11.6284 3.451 15.5145 2.60947 19.7452C1.76794 23.9758 2.19984 28.361 3.85056 32.3462C5.50128 36.3314 8.29667 39.7376 11.8832 42.134C15.4698 44.5305 19.6865 45.8096 24 45.8096C28.3135 45.8096 32.5302 44.5305 36.1168 42.134C39.7033 39.7375 42.4987 36.3314 44.1494 32.3462C45.8002 28.361 46.2321 23.9758 45.3905 19.7452C44.549 15.5145 42.4718 11.6284 39.4217 8.57829L24 24L8.57829 8.57829Z"
                fill="currentColor"
              ></path>
            </g>
            <defs>
              <clipPath id="clip0_6_319">
                <rect fill="white" height="48" width="48"></rect>
              </clipPath>
            </defs>
          </svg>
          <h1 className="text-xl font-bold tracking-tighter">
            Concept Builders
          </h1>
        </div>
        <nav className="flex items-center gap-8">
          <Link
            className="text-sm font-medium text-gray-600 hover:text-[var(--primary-color)] transition-colors"
            href="#"
          >
            Designs
          </Link>
          <Link
            className="text-sm font-medium text-gray-600 hover:text-[var(--primary-color)] transition-colors"
            href="#"
          >
            Build
          </Link>
          <Link
            className="text-sm font-medium text-gray-600 hover:text-[var(--primary-color)] transition-colors"
            href="#"
          >
            About Us
          </Link>
          <Link
            className="text-sm font-medium text-gray-600 hover:text-[var(--primary-color)] transition-colors"
            href="#"
          >
            Contact
          </Link>
        </nav>
      </div>
      <div className="flex flex-1 justify-end items-center gap-4">
        <div className="relative w-64">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            search
          </span>
          <Input
            className="form-input w-full rounded-full border-gray-300 bg-gray-100 py-2 pl-10 pr-4 text-sm focus:border-[var(--primary-color)] focus:ring-[var(--primary-color)]"
            placeholder="Search designs..."
            type="text"
          />
        </div>
        <Button className="flex items-center justify-center rounded-full h-10 px-6 bg-[var(--primary-color)] text-white text-sm font-bold tracking-wide hover:bg-opacity-90 transition-colors">
          Get Started
        </Button>
        <div
          className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 border-2 border-white shadow-md"
          style={{
            backgroundImage:
              'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAON2uwxCleDyL2Y4vx0gckj_CqVmRPnsUFgk7ya1bSk45Un3FTYXQnG-jHSTx6Nl67omJtKMRsjUFCLIhZ_vUNoSnJSsSyl8CeAxKx5GZeZ2J1IDra-9lDdTkabQ2qlynN1sPF1iVSDe5Npw5-gO5R3ZMxbQJ5qiQeEVYp4Yx9TjsGtFa8TxuxQylOaQyB5u3JHgcpLVz9TnofbrcUdiC6Z6yTzf-2VV5qj8UNg3tpCbfgGd8zcPqun4T1a7gr7KbrmVl1RH4yDkS1")',
          }}
        ></div>
      </div>
    </motion.header>
  );
}
