import {
  AirVent,
  Droplets,
  Zap,
  WashingMachine,
  PaintRoller,
  Waves,
  Trees,
  Cctv,
  MoveVertical,
  DoorOpen,
  Bug,
  Siren,
  Wrench,
  type LucideProps,
} from "lucide-react";

const map = {
  AirVent,
  Droplets,
  Zap,
  WashingMachine,
  PaintRoller,
  Waves,
  Trees,
  Cctv,
  MoveVertical,
  DoorOpen,
  Bug,
  Siren,
  Wrench,
} as const;

export const SERVICE_ICON_NAMES = Object.keys(map) as (keyof typeof map)[];

export function ServiceIcon({ name, ...props }: { name: string } & LucideProps) {
  const Icon = map[name as keyof typeof map] ?? Wrench;
  return <Icon {...props} />;
}
