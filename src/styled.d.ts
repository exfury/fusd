import "styled-components";
import type { NeumorphismTheme } from "@libs/neumorphism-ui/themes/Theme";

  // We do that because of the imported types
declare module "styled-components" {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface DefaultTheme extends NeumorphismTheme {}
}
