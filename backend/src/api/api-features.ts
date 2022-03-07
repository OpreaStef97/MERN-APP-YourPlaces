/* eslint-disable @typescript-eslint/no-explicit-any */
import { Query } from 'mongoose';

export default class APIFeatures<T, D, G> {
    public query: Query<T, D, G>;
    private queryString: { [key: string]: any };

    constructor(query: Query<T, D, G>, queryString: { [key: string]: any }) {
        this.query = query;
        this.queryString = queryString;
    }

    filter() {
        // 1A) Filtering
        const queryObj = { ...this.queryString };
        ['page', 'sort', 'limit', 'fields'].forEach(el => {
            delete queryObj[el];
        });

        // 1B) Advanced filtering
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
        // console.log(JSON.parse(queryStr));

        this.query = this.query.find(JSON.parse(queryStr)) as unknown as Query<T, D, G>;

        return this;
    }

    sort() {
        if (this.queryString.sort) {
            const sortBy = this.queryString.sort.split(',').join('');
            this.query = this.query.sort(sortBy);
        } else {
            this.query = this.query.sort('-createAt _id');
        }

        return this;
    }

    limitFields() {
        if (this.queryString.fields) {
            const fields = this.queryString.fields.split(',').join(' ');
            this.query = this.query.select(fields);
        } else {
            this.query = this.query.select('-__v');
        }

        return this;
    }

    paginate() {
        const page = this.queryString.page * 1 || 1;
        const limit = this.queryString.limit * 1 || 100;
        const skip = (page - 1) * limit;

        this.query = this.query.skip(skip).limit(limit);

        return this;
    }
}
