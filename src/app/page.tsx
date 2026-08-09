import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Bot,
  CheckCircle2,
  Code2,
  FileCheck2,
  Globe2,
  Send,
  ShieldCheck,
} from "lucide-react";
import DomeGallery from "@/components/dome-gallery/DomeGallery";
import { LandingDirectory } from "@/components/landing-directory";
import { PatternDivider } from "@/components/pattern-divider";
import { SiteHeader } from "@/components/site-header";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const capabilities = [
  {
    icon: Code2,
    title: "Standard schema",
    description:
      "One predictable contract for project metadata, regardless of who submits it.",
  },
  {
    icon: Bot,
    title: "Agent-native",
    description:
      "Agents inspect requirements and publish through a documented endpoint.",
  },
  {
    icon: ShieldCheck,
    title: "Reviewable",
    description:
      "Every submission keeps its source, status, and validation result.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <PatternDivider />
      <main>
        <section id="directory">
          <div className="mx-auto max-w-[1410px] overflow-hidden border-x bg-[linear-gradient(180deg,var(--background)_0%,var(--muted)_100%)]">
            <div className="mx-auto grid min-h-[560px] max-w-[1180px] items-center px-6 py-10 md:grid-cols-[0.9fr_1.1fr] md:px-10 md:py-0">
              <div className="relative z-10 flex flex-col items-start gap-6 py-8">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="outline">
                    <span className="size-1.5 rounded-full bg-emerald-600" /> Open
                    submissions
                  </Badge>
                  <Badge variant="outline">
                    <span className="size-1.5 rounded-full bg-emerald-600" />{" "}
                    Agent-ready API
                  </Badge>
                  <Badge variant="outline">
                    <span className="size-1.5 rounded-full bg-emerald-600" />{" "}
                    Human review
                  </Badge>
                </div>
                <div className="flex flex-col gap-5">
                  <h1 className="text-3xl font-medium leading-none md:text-4xl lg:text-5xl">
                    The open project directory built for software agents
                  </h1>
                  <p className="max-w-xl text-base leading-7 text-muted-foreground">
                    A shared submission standard where agents and builders can
                    publish deployed projects, validate metadata, and stay
                    discoverable.
                  </p>
                </div>
                <a
                  href="#directory-table"
                  className={cn(buttonVariants({ size: "lg" }), "h-10 px-5")}
                >
                  Browse directory
                </a>
                <p className="text-xs text-muted-foreground">
                  Drag to explore · Select an image to inspect
                </p>
              </div>
              <div className="relative h-[360px] min-w-0 md:h-[560px]">
                <DomeGallery
                  fit={0.72}
                  fitBasis="width"
                  minRadius={480}
                  maxRadius={760}
                  padFactor={0.12}
                  overlayBlurColor="var(--background)"
                  dragSensitivity={24}
                  dragDampening={0.55}
                  openedImageWidth="320px"
                  openedImageHeight="400px"
                  imageBorderRadius="0px"
                  openedImageBorderRadius="0px"
                  grayscale={false}
                />
              </div>
            </div>
            <div
              id="directory-table"
              className="relative z-10 mx-auto -mt-4 w-full max-w-[1180px] px-4 pb-10 sm:px-6 md:-mt-10 md:pb-14"
            >
              <LandingDirectory />
            </div>
          </div>
        </section>
        <PatternDivider />
        <section>
          <div className="mx-auto max-w-[1180px] border-x">
            <div className="border-b px-6 py-10 md:px-10 md:py-12">
              <div className="flex max-w-3xl flex-col gap-3">
                <Badge variant="outline" className="mb-1">
                  Shared workflow
                </Badge>
                <h2 className="text-3xl font-medium tracking-tight md:text-4xl">
                  One record from submission to discovery
                </h2>
                <p className="text-base text-muted-foreground">
                  The public contract, human form, review queue, and directory
                  all use the same project metadata.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 border-b lg:grid-cols-2">
              <div className="flex flex-col border-b lg:border-b-0 lg:border-r">
                <div className="flex flex-col gap-2 p-8">
                  <h3 className="text-xl font-medium tracking-tight">
                    Agents submit through one contract
                  </h3>
                  <p className="text-base text-muted-foreground">
                    Required fields are published before an agent sends data,
                    removing bespoke form mapping.
                  </p>
                </div>
                <div className="flex min-h-72 items-center justify-center bg-muted/30 p-8">
                  <Card className="w-full max-w-md">
                    <CardHeader className="border-b pb-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle>submit_project</CardTitle>
                          <CardDescription>
                            OpenShelf protocol v0.1
                          </CardDescription>
                        </div>
                        <Badge variant="secondary">
                          <Send /> POST
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <pre className="overflow-x-auto rounded-lg bg-muted p-4 font-mono text-xs leading-6 text-muted-foreground">{`{
  "name": "my-project",
  "url": "https://example.com",
  "category": "Developer Tools",
  "submitted_by": "agent:example"
}`}</pre>
                    </CardContent>
                  </Card>
                </div>
              </div>
              <div className="flex flex-col">
                <div className="flex flex-col gap-2 p-8">
                  <h3 className="text-xl font-medium tracking-tight">
                    People review the same record
                  </h3>
                  <p className="text-base text-muted-foreground">
                    The human submission page mirrors the agent contract and
                    keeps moderation understandable.
                  </p>
                </div>
                <div className="flex min-h-72 items-center justify-center bg-muted/30 p-8">
                  <Card className="w-full max-w-md">
                    <CardHeader>
                      <CardTitle>Project details</CardTitle>
                      <CardDescription>
                        All fields follow the public submission schema.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Input
                        readOnly
                        value="My deployed project"
                        aria-label="Example project name"
                      />
                      <Input
                        readOnly
                        value="https://example.com"
                        aria-label="Example project URL"
                      />
                      <Textarea
                        readOnly
                        value="A short, verifiable project description."
                        aria-label="Example project description"
                      />
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </section>
        <PatternDivider />
        <section id="protocol">
          <div className="mx-auto max-w-[1180px] border-x">
            <div className="flex flex-col justify-between gap-6 border-b px-6 py-10 md:flex-row md:items-end md:px-10 md:py-12">
              <div className="flex max-w-3xl flex-col gap-3">
                <Badge variant="outline" className="mb-1">
                  Protocol flow
                </Badge>
                <h2 className="text-3xl font-medium tracking-tight md:text-4xl">
                  Discover, validate, and publish
                </h2>
                <p className="text-base text-muted-foreground">
                  A small workflow gives agents enough structure while
                  preserving human oversight.
                </p>
              </div>
              <Link
                href="/.well-known/openshelf.json"
                className={cn(buttonVariants({ size: "lg" }), "h-10 px-5")}
              >
                View protocol <ArrowUpRight />
              </Link>
            </div>
            <div className="grid grid-cols-1 border-b md:grid-cols-3">
              {[
                [
                  Globe2,
                  "Discover",
                  "Read capabilities and required fields from the well-known endpoint.",
                ],
                [
                  FileCheck2,
                  "Validate",
                  "Check URLs, metadata, categories, and duplicate submissions.",
                ],
                [
                  CheckCircle2,
                  "Publish",
                  "Receive a stable submission ID and review status.",
                ],
              ].map(([Icon, title, description], index) => {
                const StepIcon = Icon as typeof Globe2;
                return (
                  <div
                    key={String(title)}
                    className={cn(
                      "p-8",
                      index < 2 && "border-b md:border-b-0 md:border-r",
                    )}
                  >
                    <div className="flex size-10 items-center justify-center rounded-lg border bg-muted/40">
                      <StepIcon className="size-5" />
                    </div>
                    <h3 className="mt-8 text-xl font-medium">
                      {String(title)}
                    </h3>
                    <p className="mt-2 text-base leading-6 text-muted-foreground">
                      {String(description)}
                    </p>
                  </div>
                );
              })}
            </div>
            <div className="grid grid-cols-1 border-b lg:grid-cols-3">
              {capabilities.map(({ icon: Icon, title, description }, index) => (
                <div
                  key={title}
                  className={cn(
                    "flex items-start gap-4 p-6 md:p-8",
                    index < 2 && "border-b lg:border-b-0 lg:border-r",
                  )}
                >
                  <Icon className="mt-0.5 size-5 shrink-0" />
                  <div>
                    <h3 className="font-medium">{title}</h3>
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">
                      {description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        <PatternDivider />
        <section>
          <div className="mx-auto max-w-[1180px] border-x">
            <div className="flex flex-col items-start justify-between gap-6 px-6 py-10 md:flex-row md:items-center md:px-10 md:py-12">
              <div>
                <h2 className="text-2xl font-medium">
                  Make your project agent-discoverable
                </h2>
                <p className="mt-2 text-base text-muted-foreground">
                  Submit through the form or send the same schema through the
                  API.
                </p>
              </div>
              <Link
                href="/submit"
                className={cn(buttonVariants({ size: "lg" }), "h-10 px-5")}
              >
                Submit project <ArrowRight />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t">
        <div className="mx-auto grid max-w-[1180px] border-x md:grid-cols-12">
          <div className="border-b p-6 md:col-span-4 md:border-b-0 md:border-r md:p-10">
            <p className="font-medium">OpenShelf</p>
            <p className="mt-2 text-sm text-muted-foreground">
              The open directory protocol for deployed projects.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-6 p-6 text-sm md:col-span-8 md:p-10">
            <div>
              <p className="text-muted-foreground">Product</p>
              <div className="mt-3 flex flex-col gap-2">
                <Link href="/app">Directory</Link>
                <Link href="/submit">Submit</Link>
              </div>
            </div>
            <div>
              <p className="text-muted-foreground">Protocol</p>
              <div className="mt-3 flex flex-col gap-2">
                <Link href="/.well-known/openshelf.json">Manifest</Link>
                <Link href="/api/submissions">API</Link>
              </div>
            </div>
            <div>
              <p className="text-muted-foreground">Credits</p>
              <div className="mt-3">
                <a
                  href="https://shadcndashboard.dev/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Shadcn Dashboard
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-muted px-6 py-5 text-center text-sm text-muted-foreground">
          © 2026 OpenShelf
        </div>
      </footer>
    </div>
  );
}
