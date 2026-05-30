import type { FlightDirectionFilter } from '../features/flightFilters/flightFiltersSlice';

type FlightFiltersProps = {
  search: string;
  setSearch: (value: string) => void;
  direction: FlightDirectionFilter;
  setDirection: (value: FlightDirectionFilter) => void;
};

export default function FlightFilters({
  search,
  setSearch,
  direction,
  setDirection,
}: FlightFiltersProps) {
  return (
    <>
      <input
        type="text"
        placeholder="Поиск по рейсу, маршруту или терминалу"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
      />

      <select
        value={direction}
        onChange={(event) =>
          setDirection(event.target.value as FlightDirectionFilter)
        }
      >
        <option value="all">Все направления</option>
        <option value="departure">Вылет</option>
        <option value="arrival">Прилёт</option>
      </select>
    </>
  );
}