# TODO: Fix FormGroup Initialization in Campaign Form Component

## Steps to Complete

- [x] Initialize the `form` property in `ngOnInit()` using `FormBuilder.group()` with the required form controls and nested groups to match template bindings and patchValue calls.
- [x] Ensure form controls include: `name`, `description`, `selectedTags`, `templateId`, `message` (FormGroup with `text` and `imageUrl`), and `launchDate` if needed.
- [x] Add appropriate validators (e.g., required for name and message.text).
- [x] Add ChangeDetectorRef to force UI updates after patching form and setting selectedTemplate.
- [x] Use spread operator for selectedTags array to ensure new reference for change detection.
- [x] Correct patchValue keys to match campaign data structure (selectedTags, message._id, message.text, message.imageUrl).
- [x] Set selectedTemplate from loaded templates by matching campaign.message.text and imageUrl.
- [x] Set template input box value and close template dropdown on load.
- [x] Call updateRecipientCount after patchValue to update totalRecipients count on form load.
- [ ] Test the form loading on edit to verify no runtime errors and data is correctly patched into the form fields, including selected tags and message template input.
