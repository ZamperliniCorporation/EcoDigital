import Image from 'next/image';

const Footer = () => {
  return (
    <footer className="w-full mt-8 pt-6 pb-6 text-center text-sm text-gray-500 bg-ecodigital-gray-light border-t border-gray-200">
      <div>
        <span>Desenvolvido por</span>
        <div className="flex flex-col items-center mt-4">
          <hr className="border-t-2 border-gray-400 w-40 mb-2" />
          <Image
            src="/images/EcoDigital-Logo.png"
            alt="EcoDigital Logo"
            width={80}
            height={23}
            className="opacity-80 mt-0"
          />
        </div>
      </div>
    </footer>
  );
};

export default Footer;