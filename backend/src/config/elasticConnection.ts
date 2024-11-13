import { Client } from "@elastic/elasticsearch";
import { elasticConfig } from "./settings";

let _connection: Client | undefined = undefined;

export const elasticConnection = () => {
    if (!_connection)
        _connection = new Client(elasticConfig);

    return _connection;
}

export const closeElasticConnection = async () => {
    if (_connection)
        await _connection.close();

    _connection = undefined;
}