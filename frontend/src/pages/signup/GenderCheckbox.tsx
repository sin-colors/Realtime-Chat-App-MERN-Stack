// function GenderCheckbox() {
//   return (
//     <div className="flex gap-4">
//       <div className="form-control">
//         <label className={`label cursor-pointer gap-2`}>
//           <span className="label-text">男</span>
//           <input type="checkbox" className="checkbox border border-slate-900" />
//         </label>
//       </div>
//       <div className="form-control">
//         <label className={`label cursor-pointer gap-2`}>
//           <span className="label-text">女</span>
//           <input type="checkbox" className="checkbox border border-slate-900" />
//         </label>
//       </div>
//     </div>
//   );
// }

import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";

export function GenderCheckbox() {
  return (
    <FieldGroup className="mx-auto w-56">
      <Field orientation="horizontal">
        <Checkbox id="gender-checkbox-man" name="gender-checkbox-man" />
        <FieldLabel htmlFor="gender-checkbox-man">男</FieldLabel>
        <Checkbox id="gender-checkbox-woman" name="gender-checkbox-woman" />
        <FieldLabel htmlFor="gender-checkbox-woman">女</FieldLabel>
      </Field>
    </FieldGroup>
  );
}

export default GenderCheckbox;
