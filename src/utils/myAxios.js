import axios from "axios"

export default {
    async get(params) {
        const res = await axios.get(params)
        return res.data.data;
    },

    async post(params) {
        const res = await axios.post(params)
        return res.data.data;
    },

    async put(params) {
        const res = await axios.put(params)
        return res.data.data;
    },

    async delete(params) {

        const res = 
            await axios
                .delete(params)
                .then(res => {
                    return res.data.data;
                    })
                .catch(err => {
                    handleError(err);
                    return null;
                })

        return res.data.data;
    },
}

const handleError = (error) => {
    if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx



    } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js

    } else {
        // Something happened in setting up the request that triggered an Error

    }

}