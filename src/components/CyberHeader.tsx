export const CyberHeader = () => {
  return (
    <header className="relative overflow-hidden py-8">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 backdrop-blur-sm" />
      <div className="relative z-10 text-center">
        <h1 className="text-6xl md:text-8xl font-black uppercase tracking-wider cyber-text">
          BLACK HACKERS
        </h1>
        <h2 className="text-4xl md:text-6xl font-black uppercase tracking-wider cyber-text mt-2">
          TEAM
        </h2>
        <div className="w-32 h-1 bg-gradient-to-r from-primary to-secondary mx-auto mt-4 cyber-glow" />
        <p className="text-accent mt-4 text-lg uppercase tracking-wide">
          Elite Payment Gateway System
        </p>
      </div>
    </header>
  );
};