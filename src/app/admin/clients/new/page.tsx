// src/app/admin/clients/new/page.tsx
import {createClientAction} from './actions';

export default function NewClientPage() {
  return (
    <form action={createClientAction} className="flex max-w-sm flex-col gap-3">
      <h1 className="font-display text-2xl">Add client</h1>
      <input name="name" placeholder="Name" className="rounded-full border border-line bg-bone px-4 py-2 text-sm" />
      <input
        name="phone"
        placeholder="Phone"
        className="rounded-full border border-line bg-bone px-4 py-2 text-sm"
      />
      <select
        name="visitType"
        defaultValue="studio"
        className="rounded-full border border-line bg-bone px-4 py-2 text-sm"
      >
        <option value="studio">Studio</option>
        <option value="home">Home</option>
        <option value="both">Both</option>
        <option value="corporate">Corporate</option>
      </select>
      <input
        name="source"
        placeholder="Source (e.g. referral, Instagram, walk-in)"
        className="rounded-full border border-line bg-bone px-4 py-2 text-sm"
      />
      <button type="submit" className="rounded-full bg-forest px-6 py-2 text-sm text-bone">
        Save
      </button>
    </form>
  );
}
