import AppLayout from "@/components/app-layout"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
        <AppLayout>{children}</AppLayout>
  )
}
