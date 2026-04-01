import { useState } from 'react';
import { X, ChevronDown, ChevronUp, Minus, Plus } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from './ui/sheet';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';

interface FilterSortPanelProps {
  isOpen: boolean;
  onClose: () => void;
  brands: string[];
  onApply: (filters: FilterSortState) => void;
  buttonRef?: React.RefObject<HTMLButtonElement>;
  isDesktopPopover?: boolean;
}

export interface FilterSortState {
  brand: string;
  minPoints: number;
  maxPoints: number;
  sortBy: 'destacados' | 'mayor' | 'menor';
}

export function FilterSortPanel({ isOpen, onClose, brands, onApply, isDesktopPopover }: FilterSortPanelProps) {
  const [filterExpanded, setFilterExpanded] = useState(false);
  const [sortExpanded, setSortExpanded] = useState(false);
  
  const [selectedBrand, setSelectedBrand] = useState('todas');
  const [minPoints, setMinPoints] = useState(0);
  const [maxPoints, setMaxPoints] = useState(0);
  const [sortBy, setSortBy] = useState<'destacados' | 'mayor' | 'menor'>('destacados');

  const handleApply = () => {
    onApply({
      brand: selectedBrand,
      minPoints,
      maxPoints,
      sortBy
    });
    onClose();
  };

  const toggleFilter = () => {
    setFilterExpanded(!filterExpanded);
    if (!filterExpanded) setSortExpanded(false);
  };

  const toggleSort = () => {
    setSortExpanded(!sortExpanded);
    if (!sortExpanded) setFilterExpanded(false);
  };

  return (
    <>
      {/* Mobile Sheet */}
      {!isDesktopPopover && (
        <div className="md:hidden">
          <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent side="bottom" className="h-auto rounded-t-3xl p-0 border-0">
              <div className="p-6">
                {/* Header */}
                <SheetHeader className="mb-3">
                  <SheetTitle className="text-lg font-semibold text-slate-900" style={{ fontFamily: "'Nunito', sans-serif" }}>
                    Filtrar y ordenar
                  </SheetTitle>
                  <SheetDescription className="sr-only">
                    Filtra productos por marca y puntos, y ordénalos según tus preferencias
                  </SheetDescription>
                </SheetHeader>

                <div className="space-y-4">
                  {/* Filtrar por Section */}
                  <div className="border border-slate-200 rounded-xl overflow-hidden">
                    <button
                      onClick={toggleFilter}
                      className="w-full px-4 py-3 flex items-center justify-between bg-white hover:bg-slate-50 transition-colors"
                    >
                      <span className="text-sm font-medium text-slate-700" style={{ fontFamily: "'Nunito', sans-serif" }}>
                        Filtrar por
                      </span>
                      {filterExpanded ? (
                        <ChevronUp className="w-5 h-5 text-[#FF8000]" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-slate-400" />
                      )}
                    </button>
                    
                    {filterExpanded && (
                      <div className="px-4 pb-4 pt-2 bg-white border-t border-slate-100">
                        {/* Marca */}
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-slate-700 mb-2" style={{ fontFamily: "'Nunito', sans-serif" }}>
                            Marca
                          </label>
                          <div className="relative">
                            <select
                              value={selectedBrand}
                              onChange={(e) => setSelectedBrand(e.target.value)}
                              className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-white text-sm text-slate-700 appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#FF8000]/20 focus:border-[#FF8000] transition-all"
                              style={{ fontFamily: "'Nunito', sans-serif" }}
                            >
                              <option value="todas">Todas las marcas</option>
                              {brands.map(brand => (
                                <option key={brand} value={brand}>{brand}</option>
                              ))}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                          </div>
                        </div>

                        {/* Puntos */}
                        <div className="mb-2">
                          <label className="block text-sm font-medium text-slate-700 mb-2" style={{ fontFamily: "'Nunito', sans-serif" }}>
                            Puntos
                          </label>
                        </div>

                        {/* Puntos mínimos */}
                        <div className="mb-3">
                          <label className="block text-xs text-slate-600 mb-2" style={{ fontFamily: "'Nunito', sans-serif" }}>
                            Puntos mínimos
                          </label>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setMinPoints(Math.max(0, minPoints - 1))}
                              className="w-10 h-10 rounded-lg bg-[#FF8000] hover:bg-[#FF8000]/90 flex items-center justify-center transition-colors active:scale-95"
                            >
                              <Minus className="w-5 h-5 text-white" />
                            </button>
                            <input
                              type="number"
                              value={minPoints}
                              onChange={(e) => setMinPoints(Math.max(0, parseInt(e.target.value) || 0))}
                              className="flex-1 px-4 py-2.5 rounded-lg border border-slate-200 bg-white text-center text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#FF8000]/20 focus:border-[#FF8000] transition-all"
                              style={{ fontFamily: "'Nunito', sans-serif" }}
                            />
                            <button
                              onClick={() => setMinPoints(minPoints + 1)}
                              className="w-10 h-10 rounded-lg bg-[#FF8000] hover:bg-[#FF8000]/90 flex items-center justify-center transition-colors active:scale-95"
                            >
                              <Plus className="w-5 h-5 text-white" />
                            </button>
                          </div>
                        </div>

                        {/* Puntos máximos */}
                        <div>
                          <label className="block text-xs text-slate-600 mb-2" style={{ fontFamily: "'Nunito', sans-serif" }}>
                            Puntos máximos
                          </label>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setMaxPoints(Math.max(0, maxPoints - 1))}
                              className="w-10 h-10 rounded-lg bg-[#FF8000] hover:bg-[#FF8000]/90 flex items-center justify-center transition-colors active:scale-95"
                            >
                              <Minus className="w-5 h-5 text-white" />
                            </button>
                            <input
                              type="number"
                              value={maxPoints}
                              onChange={(e) => setMaxPoints(Math.max(0, parseInt(e.target.value) || 0))}
                              className="flex-1 px-4 py-2.5 rounded-lg border border-slate-200 bg-white text-center text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#FF8000]/20 focus:border-[#FF8000] transition-all"
                              style={{ fontFamily: "'Nunito', sans-serif" }}
                            />
                            <button
                              onClick={() => setMaxPoints(maxPoints + 1)}
                              className="w-10 h-10 rounded-lg bg-[#FF8000] hover:bg-[#FF8000]/90 flex items-center justify-center transition-colors active:scale-95"
                            >
                              <Plus className="w-5 h-5 text-white" />
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Ordenar por Section */}
                  <div className="border border-slate-200 rounded-xl overflow-hidden">
                    <button
                      onClick={toggleSort}
                      className="w-full px-4 py-3 flex items-center justify-between bg-white hover:bg-slate-50 transition-colors"
                    >
                      <span className="text-sm font-medium text-slate-700" style={{ fontFamily: "'Nunito', sans-serif" }}>
                        Ordenar por
                      </span>
                      {sortExpanded ? (
                        <ChevronUp className="w-5 h-5 text-[#FF8000]" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-slate-400" />
                      )}
                    </button>
                    
                    {sortExpanded && (
                      <div className="px-4 pb-4 pt-2 bg-white border-t border-slate-100">
                        <RadioGroup value={sortBy} onValueChange={(value) => setSortBy(value as any)}>
                          <div className="space-y-3">
                            <div className="flex items-center space-x-3">
                              <RadioGroupItem 
                                value="destacados" 
                                id="destacados"
                                className="border-2 border-slate-300 text-[#FF8000] data-[state=checked]:border-[#FF8000]"
                              />
                              <Label 
                                htmlFor="destacados" 
                                className="text-sm font-medium text-slate-700 cursor-pointer"
                                style={{ fontFamily: "'Nunito', sans-serif" }}
                              >
                                Destacados
                              </Label>
                            </div>
                            <div className="flex items-center space-x-3">
                              <RadioGroupItem 
                                value="mayor" 
                                id="mayor"
                                className="border-2 border-slate-300 text-[#FF8000] data-[state=checked]:border-[#FF8000]"
                              />
                              <Label 
                                htmlFor="mayor" 
                                className="text-sm font-medium text-slate-700 cursor-pointer"
                                style={{ fontFamily: "'Nunito', sans-serif" }}
                              >
                                Puntos de Mayor a Menor
                              </Label>
                            </div>
                            <div className="flex items-center space-x-3">
                              <RadioGroupItem 
                                value="menor" 
                                id="menor"
                                className="border-2 border-slate-300 text-[#FF8000] data-[state=checked]:border-[#FF8000]"
                              />
                              <Label 
                                htmlFor="menor" 
                                className="text-sm font-medium text-slate-700 cursor-pointer"
                                style={{ fontFamily: "'Nunito', sans-serif" }}
                              >
                                Puntos de Menor a Mayor
                              </Label>
                            </div>
                          </div>
                        </RadioGroup>
                      </div>
                    )}
                  </div>

                  {/* Aplicar Button */}
                  <button
                    onClick={handleApply}
                    className="w-full py-3 rounded-full bg-[#FF8000] hover:bg-[#FF8000]/90 text-white font-semibold text-sm shadow-[0_0_12px_rgba(255,128,0,0.25)] hover:shadow-[0_0_16px_rgba(255,128,0,0.35)] transition-all active:scale-95"
                    style={{ fontFamily: "'Nunito', sans-serif" }}
                  >
                    Aplicar
                  </button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      )}

      {/* Desktop Popover */}
      {isDesktopPopover && (
        <div className="p-4 space-y-3 max-h-[70vh] overflow-y-auto">
          {/* Filtrar por Section */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <button
              onClick={toggleFilter}
              className="w-full px-3 py-2.5 flex items-center justify-between bg-white hover:bg-slate-50 transition-colors"
            >
              <span className="text-sm font-medium text-slate-700" style={{ fontFamily: "'Nunito', sans-serif" }}>
                Filtrar por
              </span>
              {filterExpanded ? (
                <ChevronUp className="w-4 h-4 text-[#FF8000]" />
              ) : (
                <ChevronDown className="w-4 h-4 text-slate-400" />
              )}
            </button>
            
            {filterExpanded && (
              <div className="px-3 pb-3 pt-2 bg-white border-t border-slate-100">
                {/* Marca */}
                <div className="mb-3">
                  <label className="block text-xs font-medium text-slate-700 mb-1.5" style={{ fontFamily: "'Nunito', sans-serif" }}>
                    Marca
                  </label>
                  <div className="relative">
                    <select
                      value={selectedBrand}
                      onChange={(e) => setSelectedBrand(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm text-slate-700 appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#FF8000]/20 focus:border-[#FF8000] transition-all"
                      style={{ fontFamily: "'Nunito', sans-serif" }}
                    >
                      <option value="todas">Todas las marcas</option>
                      {brands.map(brand => (
                        <option key={brand} value={brand}>{brand}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                {/* Puntos */}
                <div className="mb-1.5">
                  <label className="block text-xs font-medium text-slate-700 mb-1.5" style={{ fontFamily: "'Nunito', sans-serif" }}>
                    Puntos
                  </label>
                </div>

                {/* Puntos mínimos */}
                <div className="mb-2">
                  <label className="block text-[10px] text-slate-600 mb-1" style={{ fontFamily: "'Nunito', sans-serif" }}>
                    Puntos mínimos
                  </label>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setMinPoints(Math.max(0, minPoints - 1))}
                      className="w-8 h-8 rounded-lg bg-[#FF8000] hover:bg-[#FF8000]/90 flex items-center justify-center transition-colors active:scale-95"
                    >
                      <Minus className="w-4 h-4 text-white" />
                    </button>
                    <input
                      type="number"
                      value={minPoints}
                      onChange={(e) => setMinPoints(Math.max(0, parseInt(e.target.value) || 0))}
                      className="flex-1 px-2 py-2 rounded-lg border border-slate-200 bg-slate-50 text-center text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#FF8000]/20 focus:border-[#FF8000] transition-all"
                      style={{ fontFamily: "'Nunito', sans-serif" }}
                    />
                    <button
                      onClick={() => setMinPoints(minPoints + 1)}
                      className="w-8 h-8 rounded-lg bg-[#FF8000] hover:bg-[#FF8000]/90 flex items-center justify-center transition-colors active:scale-95"
                    >
                      <Plus className="w-4 h-4 text-white" />
                    </button>
                  </div>
                </div>

                {/* Puntos máximos */}
                <div>
                  <label className="block text-[10px] text-slate-600 mb-1" style={{ fontFamily: "'Nunito', sans-serif" }}>
                    Puntos máximos
                  </label>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setMaxPoints(Math.max(0, maxPoints - 1))}
                      className="w-8 h-8 rounded-lg bg-[#FF8000] hover:bg-[#FF8000]/90 flex items-center justify-center transition-colors active:scale-95"
                    >
                      <Minus className="w-4 h-4 text-white" />
                    </button>
                    <input
                      type="number"
                      value={maxPoints}
                      onChange={(e) => setMaxPoints(Math.max(0, parseInt(e.target.value) || 0))}
                      className="flex-1 px-2 py-2 rounded-lg border border-slate-200 bg-slate-50 text-center text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#FF8000]/20 focus:border-[#FF8000] transition-all"
                      style={{ fontFamily: "'Nunito', sans-serif" }}
                    />
                    <button
                      onClick={() => setMaxPoints(maxPoints + 1)}
                      className="w-8 h-8 rounded-lg bg-[#FF8000] hover:bg-[#FF8000]/90 flex items-center justify-center transition-colors active:scale-95"
                    >
                      <Plus className="w-4 h-4 text-white" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Ordenar por Section */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <button
              onClick={toggleSort}
              className="w-full px-3 py-2.5 flex items-center justify-between bg-white hover:bg-slate-50 transition-colors"
            >
              <span className="text-sm font-medium text-slate-700" style={{ fontFamily: "'Nunito', sans-serif" }}>
                Ordenar por
              </span>
              {sortExpanded ? (
                <ChevronUp className="w-4 h-4 text-[#FF8000]" />
              ) : (
                <ChevronDown className="w-4 h-4 text-slate-400" />
              )}
            </button>
            
            {sortExpanded && (
              <div className="px-3 pb-3 pt-2 bg-white border-t border-slate-100">
                <RadioGroup value={sortBy} onValueChange={(value) => setSortBy(value as any)}>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem 
                        value="destacados" 
                        id="destacados-desktop"
                        className="border-2 border-slate-300 text-[#FF8000] data-[state=checked]:border-[#FF8000] w-4 h-4"
                      />
                      <Label 
                        htmlFor="destacados-desktop" 
                        className="text-xs font-medium text-slate-700 cursor-pointer"
                        style={{ fontFamily: "'Nunito', sans-serif" }}
                      >
                        Destacados
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem 
                        value="mayor" 
                        id="mayor-desktop"
                        className="border-2 border-slate-300 text-[#FF8000] data-[state=checked]:border-[#FF8000] w-4 h-4"
                      />
                      <Label 
                        htmlFor="mayor-desktop" 
                        className="text-xs font-medium text-slate-700 cursor-pointer"
                        style={{ fontFamily: "'Nunito', sans-serif" }}
                      >
                        Puntos de Mayor a Menor
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem 
                        value="menor" 
                        id="menor-desktop"
                        className="border-2 border-slate-300 text-[#FF8000] data-[state=checked]:border-[#FF8000] w-4 h-4"
                      />
                      <Label 
                        htmlFor="menor-desktop" 
                        className="text-xs font-medium text-slate-700 cursor-pointer"
                        style={{ fontFamily: "'Nunito', sans-serif" }}
                      >
                        Puntos de Menor a Mayor
                      </Label>
                    </div>
                  </div>
                </RadioGroup>
              </div>
            )}
          </div>

          {/* Aplicar Button */}
          <button
            onClick={handleApply}
            className="w-full py-2.5 rounded-full bg-[#FF8000] hover:bg-[#FF8000]/90 text-white font-semibold text-sm shadow-[0_0_12px_rgba(255,128,0,0.25)] hover:shadow-[0_0_16px_rgba(255,128,0,0.35)] transition-all active:scale-95"
            style={{ fontFamily: "'Nunito', sans-serif" }}
          >
            Aplicar
          </button>
        </div>
      )}
    </>
  );
}