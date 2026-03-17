// src/app/form-detect/page.tsx
export default function FormDetect() {
  return (
    <form name="contact" data-netlify="true" hidden>
      <input type="text" name="name" />
      <input type="email" name="name" />
      <textarea name="message"></textarea>
    </form>
  );
}
