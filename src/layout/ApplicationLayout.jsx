import { logout } from "../utils/auth.js";
import { useNavigate } from "react-router-dom";
import { Avatar } from "../components/avatar.jsx";
import {
  Dropdown,
  DropdownButton,
  DropdownDivider,
  DropdownItem,
  DropdownLabel,
  DropdownMenu,
} from "../components/dropdown.jsx";
import {
  Navbar,
  NavbarItem,
  NavbarSection,
  NavbarSpacer,
} from "../components/navbar.jsx";
import { ThemeToggle } from "../components/ThemeToggle.jsx";
import {
  Sidebar,
  SidebarBody,
  SidebarFooter,
  SidebarHeader,
  SidebarHeading,
  SidebarItem,
  SidebarLabel,
  SidebarSection,
  SidebarSpacer,
} from "../components/sidebar.jsx";
import { SidebarLayout } from "../components/sidebar-layout.jsx";
import {
  ArrowRightStartOnRectangleIcon,
  BookmarkSlashIcon,
  BookmarkSquareIcon,
  BookOpenIcon,
  CheckBadgeIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  Cog8ToothIcon,
  LightBulbIcon,
  PaperClipIcon,
  PlusIcon,
  RectangleStackIcon,
  ShieldCheckIcon,
  Square3Stack3DIcon,
  Squares2X2Icon,
  UserCircleIcon,
} from "@heroicons/react/16/solid";
import {
  Cog6ToothIcon,
  HomeIcon,
  QuestionMarkCircleIcon,
  SparklesIcon,
  Square2StackIcon,
  TicketIcon,
  ChartBarIcon,
  CubeIcon,
  GiftIcon,
  PresentationChartBarIcon,
  TagIcon,
  PhotoIcon,
  EnvelopeIcon,
} from "@heroicons/react/20/solid";
import { useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

function AccountDropdownMenu({ anchor }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  return (
    <DropdownMenu className="min-w-64" anchor={anchor}>
      {/* <DropdownItem href="#">
      <UserCircleIcon />
      <DropdownLabel>My account</DropdownLabel>
    </DropdownItem> */}
      {/* <DropdownDivider /> */}
      <DropdownItem onClick={handleLogout}>
        <ArrowRightStartOnRectangleIcon />
        <DropdownLabel>Sign out</DropdownLabel>
      </DropdownItem>
    </DropdownMenu>
  );
}
export function ApplicationLayout({ children }) {
  const user = useAuth();
  const location = useLocation();
  return (
    <SidebarLayout
      navbar={
        <Navbar>
          <NavbarSpacer />
          <NavbarSection>
            <ThemeToggle />
            <Dropdown>
              <DropdownButton as={NavbarItem}>
                <Avatar
                  src="https://ik.imagekit.io/8znjbhgdh/favicon.ico"
                  square
                />
              </DropdownButton>
              <AccountDropdownMenu anchor="bottom end" />
            </Dropdown>
          </NavbarSection>
        </Navbar>
      }
      sidebar={
        <Sidebar>
          <SidebarHeader>
            <SidebarItem>
              <Avatar src="https://ik.imagekit.io/8znjbhgdh/favicon.ico" />
              <SidebarLabel>GTW Admin</SidebarLabel>
            </SidebarItem>
          </SidebarHeader>

          <SidebarBody>
            <SidebarSection>
              <SidebarItem href="/" current={location.pathname === "/"}>
                <HomeIcon />
                <SidebarLabel>Dashboard</SidebarLabel>
              </SidebarItem>

              <SidebarItem
                href="/get-started-forms"
                current={location.pathname.startsWith("/get-started-forms")}
              >
                <Square2StackIcon />
                <SidebarLabel>Get Started Forms</SidebarLabel>
              </SidebarItem>

              <SidebarItem
                href="/join-team"
                current={location.pathname.startsWith("/join-team")}
              >
                <UserCircleIcon />
                <SidebarLabel>Join Team</SidebarLabel>
              </SidebarItem>

              <SidebarItem
                href="/agency-partnership"
                current={location.pathname.startsWith("/agency-partnership")}
              >
                <SparklesIcon />
                <SidebarLabel>Agency Partnership</SidebarLabel>
              </SidebarItem>

              <SidebarItem
                href="/subscriptions"
                current={location.pathname.startsWith("/subscriptions")}
              >
                <EnvelopeIcon />
                <SidebarLabel>Subscriptions</SidebarLabel>
              </SidebarItem>

              <SidebarItem
                href="/success-stories"
                current={location.pathname.startsWith("/success-stories")}
              >
                <CheckBadgeIcon />
                <SidebarLabel>Success Stories</SidebarLabel>
              </SidebarItem>

              <SidebarItem
                href="/hirezy-signup"
                current={location.pathname.startsWith("/hirezy-signup")}
              >
                <Squares2X2Icon />
                <SidebarLabel>Hirezy Signup Enteries</SidebarLabel>
              </SidebarItem>
              <SidebarItem
                href="/framework-pdf-forms"
                current={location.pathname.startsWith("/framework-pdf-forms")}
              >
                <Squares2X2Icon />
                <SidebarLabel>Framework PDF Enteries</SidebarLabel>
              </SidebarItem>

              <SidebarItem
                href="/hirezy-contact"
                current={location.pathname.startsWith("/hirezy-contact")}
              >
                <Squares2X2Icon />
                <SidebarLabel>Hirezy Contact Form</SidebarLabel>
              </SidebarItem>

              <SidebarItem
                href="/case-studies"
                current={location.pathname.startsWith("/case-studies")}
              >
                <Squares2X2Icon />
                <SidebarLabel>Case Studies</SidebarLabel>
              </SidebarItem>

              {/* <SidebarItem
                href="/subcategories"
                current={location.pathname.startsWith("/subcategories")}
              >
                <RectangleStackIcon />
                <SidebarLabel>Subcategories</SidebarLabel>
              </SidebarItem> */}

              {/* <SidebarItem
                href="/customers"
                current={location.pathname.startsWith("/customers")}
              >
                <UserCircleIcon />
                <SidebarLabel>Customers</SidebarLabel>
              </SidebarItem> */}

              {/* <SidebarItem
                href="/marketing"
                current={location.pathname.startsWith("/marketing")}
              >
                <PresentationChartBarIcon />
                <SidebarLabel>Marketing</SidebarLabel>
              </SidebarItem> */}

              {/* <SidebarItem
                href="/discount"
                current={location.pathname.startsWith("/discount")}
              >
                <GiftIcon />
                <SidebarLabel>Discount</SidebarLabel>
              </SidebarItem> */}

              {/* <SidebarItem
                href="/media"
                current={location.pathname.startsWith("/media")}
              >
                <PhotoIcon />
                <SidebarLabel>Media</SidebarLabel>
              </SidebarItem> */}

              {/* <SidebarItem href="/content" current={location.pathname.startsWith('/content')}>
                    <CubeIcon />
                    <SidebarLabel>Content</SidebarLabel>
                </SidebarItem> */}

              {/* <SidebarItem
                href="/markets"
                current={location.pathname.startsWith("/markets")}
              >
                <ChartBarIcon />
                <SidebarLabel>Markets</SidebarLabel>
              </SidebarItem> */}
            </SidebarSection>

            {/* <SidebarSection className="max-lg:hidden">
                <SidebarHeading>Manage Website</SidebarHeading>

                <SidebarItem href="/form-entries" current={location.pathname.startsWith('/form-entries')}>
                    <UserCircleIcon />
                    <SidebarLabel>Form Entries</SidebarLabel>
                </SidebarItem>


            </SidebarSection> */}

            <SidebarSpacer />
          </SidebarBody>

          <SidebarFooter className="max-lg:hidden">
            <Dropdown>
              <DropdownButton as={SidebarItem}>
                <span className="flex min-w-0 items-center gap-3">
                  <Avatar
                    src="https://ik.imagekit.io/8znjbhgdh/favicon.ico"
                    className="size-10"
                    square
                    alt=""
                  />
                  <span className="min-w-0">
                    <span className="block truncate text-sm/5 font-medium text-zinc-950 dark:text-white">
                      {user?.user?.name || ""}
                    </span>
                    <span className="block truncate text-xs/5 font-normal text-zinc-500 dark:text-zinc-400">
                      {user?.user?.email || "xyz@gmail.com"}
                    </span>
                  </span>
                </span>
                <ChevronUpIcon />
              </DropdownButton>
              <AccountDropdownMenu anchor="top start" />
            </Dropdown>
          </SidebarFooter>
        </Sidebar>
      }
    >
      {children}
    </SidebarLayout>
  );
}
