'use client';

export function DeleteClientButton({clientName}: {clientName: string}) {
  return (
    <button
      type="submit"
      className="rounded-full border border-red-600 px-4 py-2 text-sm text-red-600"
      onClick={(event) => {
        if (!window.confirm(`Delete ${clientName}? This also deletes their packages and activity log. This cannot be undone.`)) {
          event.preventDefault();
        }
      }}
    >
      Delete client
    </button>
  );
}
