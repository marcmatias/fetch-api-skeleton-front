export default class DataFetch {

    /**
     * Get API data as JSON
     *
     * @param  {string} url
     *
     * @return {JSON}  Data as JSON
     */
    async getApiData(url: string): Promise<JSON> {
        // Storing response
        try {
            const response = await fetch(url);
            // Storing data in form of JSON
            let jsonData = await response.json();

            // If API returning status return data
            if (jsonData.hasOwnProperty("status")) {
                jsonData = jsonData.data;
            }

            return jsonData;

        } catch (error) {
            throw error;
        }

    }

}