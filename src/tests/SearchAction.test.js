import { fetchSearchResults } from '../redux/actions/searchAction';

describe('fetchSearchResults action creator', () => {

    it('should be a function', () => {
        expect(typeof fetchSearchResults).toBe('function');
    });
});
