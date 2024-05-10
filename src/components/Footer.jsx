const Footer = ({ fixed }) => {
  const style = fixed
    ? "bg-primary text-gray-300 py-4 text-center text-xl w-full fixed bottom-0"
    : "bg-primary text-gray-300 py-4 text-center text-xl";
  return (
    <footer className={style}>
      <div className="container mx-auto">
        <p>&copy; 2024 ReelFlix. All rights reserved.</p>
      </div>
    </footer>
  );
};
export default Footer;
