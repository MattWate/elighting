// src/app/form-detect/page.tsx

export default function FormDetect() {
  return (
    /* We use data-netlify="true" instead of "netlify" to satisfy the parser.
       The 'as any' cast tells TypeScript to ignore the custom attribute check.
    */
    <form 
      name="contact" 
      {...{ "data-netlify": "true" } as any} 
      hidden
    >
      <input type="text" name="name" />
      <input type="email" name="email" />
      <textarea name="message"></textarea>
    </form>
  );
}
