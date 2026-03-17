// src/app/form-detect/page.tsx
export default function FormDetect() {
  return (
    <form name="contact" netlify hidden>>
      <input type="text" name="name" />
      <input type="email" name="name" />
      <textarea name="message"></textarea>
    </form>
  );
}
