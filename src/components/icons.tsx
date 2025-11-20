import type { SVGProps } from "react";

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
      width={props.width || "1.5em"}
      height={props.height || "1.5em"}
      {...props}
      fill="currentColor"
    >
      <path d="M144 32H64a16 16 0 0 0-16 16v160a16 16 0 0 0 16 16h128a16 16 0 0 0 16-16V96ZM64 48h72v48h48v128H64Z" opacity=".2"/>
      <path d="M208 88h-56V32Z" opacity=".2"/>
      <path d="M213.66 82.34l-56-56A8 8 0 0 0 152 24H64a24 24 0 0 0-24 24v160a24 24 0 0 0 24 24h128a24 24 0 0 0 24-24V88a8 8 0 0 0-2.34-5.66ZM160 51.31L188.69 80H160ZM192 216H64a8 8 0 0 1-8-8V48a8 8 0 0 1 8-8h80v48a8 8 0 0 0 8 8h48v112a8 8 0 0 1-8 8Z"/>
    </svg>
  );
}
