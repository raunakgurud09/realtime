// import socials from "@/data/author/socials";
// import Logo from "../Logo";

import Logo from "../Common/Logo"

const socials: any = []

const footer = [
  {
    heading: 'Socials',
    options: [
      {
        url: 'https://github.com/raunakgurud09',
        name: 'Github',
      },
      {
        url: 'https://instagram.com/raunak_gurud',
        name: 'Instagram',
      },
      {
        url: 'https://www.linkedin.com/in/raunakgurud/',
        name: 'Linkedin',
      },
      {
        url: 'https://x.com/RaunakGurud',
        name: 'Twitter',
      },
      {
        url: 'raunakgurud2121@gmail.com',
        name: 'Mail',
      },
      {
        url: 'https://raunakgurud.hashnode.dev',
        name: 'Hashnode',
      },
    ],
  },
  {
    heading: 'More info',
    options: [
      {
        url: 'https://github.com/raunakgurud09/realtime',
        name: 'Source code',
      },
      {
        url: '/sitemap.xml',
        name: 'Sitemap',
      },
    ],
  },
]


export default function HomeFooter() {
  const year = new Date().getFullYear()

  return (
    <footer className="flex border-t py-6 justify-evenly items-center text-sm text-400">
      <div className="max-w-7xl px-4 w-full flex-row py-4 sm:flex justify-between">
        <div className="flex flex-col justify-start ">
          <Logo />
          {/* <p>&#169; {year} Raunak Gurud</p> */}
          <div className="flex space-x-4 text-300 p-2 items-center">
            {socials.map((social: any) => (
              <a
                key={social.id}
                href={social.url}
                target="_blank"
                rel="noreferrer"
                className="w-4 hover:text-primary-500"
                aria-label={social.name}
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>
        <div className="flex-1"></div>
        <div className="flex space-x-5">
          {footer.map(({ heading, options }) => (
            <div className="w-fit" key={heading}>
              <h4 className="font-bold text-md py-[2px]">{heading}</h4>
              <ul className="text-xs">
                {options.map((option) => (
                  <a
                    href={option.url}
                    key={option.name}
                    target="_blank"
                    rel="noreferrer"
                    className="text-white hover:opacity-100 opacity-70"
                    aria-label={option.name}
                  >
                    <li className="py-[2px]">{option.name}</li>
                  </a>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </footer>

  )
}
