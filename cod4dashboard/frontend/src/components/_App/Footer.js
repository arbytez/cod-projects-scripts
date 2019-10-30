import Link from 'next/link';

const GitHubIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22" />
    </svg>
  );
};

function Footer() {
  return (
    <footer className="bg-gray-100 flex items-center justify-center italic mx-auto py-1 px-2 underline text-sm text-gray-800">
      <a
        href="https://github.com/arbytez/cod-projects-scripts/tree/master/cod4dashboard"
        className="font-bold tracking-wider"
      >
        <div className="flex">
          <GitHubIcon />
          <span className="ml-2">arbytez</span>
        </div>
      </a>
    </footer>
  );
}

export default Footer;
