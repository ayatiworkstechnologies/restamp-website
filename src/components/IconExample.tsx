import { HugeiconsIcon } from "@hugeicons/react";
import {
  Home01Icon,
  SearchIcon,
  UserIcon,
  Location01Icon,
  FavouriteIcon,
  Settings01Icon,
} from "@hugeicons/core-free-icons";

export default function IconExample() {
  return (
    <div className="flex items-center gap-5 p-4 bg-white rounded-xl shadow-xs border border-slate-200">
      <HugeiconsIcon icon={Home01Icon} size={24} className="text-[#087ed9]" />
      <HugeiconsIcon icon={SearchIcon} size={24} className="text-slate-700" />
      <HugeiconsIcon icon={UserIcon} size={24} className="text-slate-700" />
      <HugeiconsIcon icon={Location01Icon} size={24} className="text-slate-700" />
      <HugeiconsIcon icon={FavouriteIcon} size={24} className="text-red-500" />
      <HugeiconsIcon icon={Settings01Icon} size={24} className="text-slate-700" />
    </div>
  );
}
