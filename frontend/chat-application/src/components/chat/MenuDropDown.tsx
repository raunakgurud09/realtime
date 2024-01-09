import { Fragment } from 'react'
import { Menu } from '@headlessui/react'
import { HiDotsVertical } from "react-icons/hi";


const links = [
  { href: '/account-settings', label: 'Account settings' },
  { href: '/support', label: 'Support' },
  { href: '/license', label: 'License' },
  { href: '/sign-out', label: 'Sign out' },
]

export function MyMenu() {
  return (
    <Menu>
      <Menu.Button>
        <HiDotsVertical size={20} />
      </Menu.Button>
      <Menu.Items
        className="absolute z-20 flex flex-col top-16 right-5 p-2 rounded-xl bg-black"
      >
        {links.map((link) => (
          /* Use the `active` state to conditionally style the active item. */
          <Menu.Item key={link.href} as={Fragment}>
            {({ active }) => (
              <p
                // href={link.href}
                className={`${active ? 'bg-white text-black' : 'bg-transparent text-white'}`}
              >
                {link.label}
              </p>
            )}
          </Menu.Item>
        ))}
      </Menu.Items>
    </Menu>
  )
}