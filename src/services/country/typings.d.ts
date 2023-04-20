declare namespace API {
  type CitiesDto = {
    id?: number;
    name?: string;
    stateId?: number;
    stateCode?: string;
    countryId?: number;
    countryCode?: string;
    latitude?: number;
    longitude?: number;
    createdAt?: string;
    updatedAt?: string;
    flag?: number;
    wikidataid?: string;
  };

  type CountriesDto = {
    id?: number;
    name?: string;
    iso3?: string;
    numericCode?: string;
    iso2?: string;
    phonecode?: string;
    capital?: string;
    currency?: string;
    currencyName?: string;
    currencySymbol?: string;
    tld?: string;
    region?: string;
    subregion?: string;
    timezones?: string;
    translations?: string;
    latitude?: number;
    longitude?: number;
    emoji?: string;
    emojiu?: string;
    createdAt?: string;
    updatedAt?: string;
    flag?: number;
    wikidataid?: string;
  };

  type get1Params = {
    id: number;
  };

  type get2Params = {
    id: number;
  };

  type getAllCitiesParams = {
    id: number;
  };

  type getAllParams = {
    include?: string[];
  };

  type getAllStatesParams = {
    id: number;
  };

  type getParams = {
    id: number;
  };

  type page1Params = {
    params: PaginationDto;
  };

  type page2Params = {
    params: PaginationDto;
  };

  type pageParams = {
    params: PaginationDto;
  };

  type PaginationDto = {
    current?: number;
    pageSize?: number;
    orderFields?: string[];
    orderTypes?: string[];
    include?: string[];
  };

  type Result = {
    success?: boolean;
    code?: number;
    msg?: string;
    data?: Record<string, any>;
  };

  type StatesDto = {
    id?: number;
    name?: string;
    countryId?: number;
    countryCode?: string;
    fipsCode?: string;
    iso2?: string;
    type?: string;
    latitude?: number;
    longitude?: number;
    createdAt?: string;
    updatedAt?: string;
    flag?: number;
    wikidataid?: string;
  };
}
