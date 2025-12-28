export interface IMapper<T, U> {
    map(data: T): U;        // Converts data from type T to type U example T is the parsed object and U is the model class.
   reverseMap(data: U): T; // Converts data back from type U to type T.
}