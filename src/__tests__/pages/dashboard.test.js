import React from 'react';
import { render, waitFor, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { act } from 'react-dom/test-utils';
import Dashboard from '../../pages/dashboard';
import UserContext from '../../context/user';
import FirebaseContext from '../../context/firebase';
import LoggedInUserContext from '../../context/logged-in-user';
import userFixture from '../../fixtures/logged-in-user';
import photosFixture from '../../fixtures/timeline-photos';
import suggestedProfilesFixture from '../../fixtures/suggested-profiles';
import { getPhotos, getSuggestedProfiles } from '../../services/firebase';
import useUser from '../../hooks/use-user';

const mockHistoryPush = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: mockHistoryPush,
  }),
}));

jest.mock('../../services/firebase');
jest.mock('../../hooks/use-user');

describe('<Dashboard />', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it(`renders the dashboard with a user profile and follows a user from the suggested
   profile sidebar`, async () => {
    await act(async () => {
      getPhotos.mockImplementation(() => photosFixture);
      getSuggestedProfiles.mockImplementation(() => suggestedProfilesFixture);
      useUser.mockImplementation(() => ({ user: userFixture }));

      const firebase = {
        firestore: jest.fn(() => ({
          collection: jest.fn(() => ({
            doc: jest.fn(() => ({
              update: jest.fn(() => Promise.resolve('User added')),
            })),
          })),
        })),
      };
      const fieldValues = {
        arrayUnion: jest.fn(),
        arrayRemove: jest.fn(),
      };

      const {
        getByText,
        getByAltText,
        getByTitle,
        getAllByText,
        // getAllByAltText,
        getByTestId,
      } = render(
        <Router>
          <FirebaseContext.Provider
            value={{ firebase, FieldValue: fieldValues }}
          >
            <UserContext.Provider
              value={{
                user: {
                  uid: 'JNoMPWmBTpMcTdAcfvYV51hpODW2',
                  displayName: 'itamar',
                },
              }}
            >
              <LoggedInUserContext.Provider value={{ user: userFixture }}>
                <Dashboard
                  user={{
                    uid: 'JNoMPWmBTpMcTdAcfvYV51hpODW2',
                    displayName: 'itamar',
                  }}
                />
              </LoggedInUserContext.Provider>
            </UserContext.Provider>
          </FirebaseContext.Provider>
        </Router>
      );

      await waitFor(() => {
        expect(document.title).toEqual('Instagram');
        expect(getByTitle('Sign Out')).toBeTruthy();
        expect(getAllByText('raphael')).toBeTruthy();
        expect(getByAltText('Instagram')).toBeTruthy();
        expect(getByAltText('itamar profile')).toBeTruthy();
        expect(getAllByText('Saint George and the Dragon')).toBeTruthy();
        expect(getByText('Suggestions for you')).toBeTruthy();

        fireEvent.click(getByText('Follow'));
        fireEvent.click(getByTestId('like-photo-494LKmaF03bUcYZ4xhNu'));
        fireEvent.keyDown(getByTestId('like-photo-494LKmaF03bUcYZ4xhNu'), {
          key: 'Enter',
        });
        fireEvent.click(getByTestId('focus-input-494LKmaF03bUcYZ4xhNu'));
        fireEvent.change(getByTestId('add-comment-494LKmaF03bUcYZ4xhNu'), {
          target: { value: 'Amazing photo!' },
        });
        fireEvent.submit(
          getByTestId('add-comment-submit-494LKmaF03bUcYZ4xhNu')
        );
        fireEvent.change(getByTestId('add-comment-494LKmaF03bUcYZ4xhNu'), {
          target: { value: '' },
        });
        fireEvent.submit(
          getByTestId('add-comment-submit-494LKmaF03bUcYZ4xhNu')
        );
        fireEvent.keyDown(getByTestId('focus-input-494LKmaF03bUcYZ4xhNu'), {
          key: 'Enter',
        });
        fireEvent.submit(
          getByTestId('add-comment-submit-494LKmaF03bUcYZ4xhNu')
        );
      });
    });
  });

  it('renders the dashboard with a user profile of undefined', async () => {
    await act(async () => {
      getPhotos.mockImplementation(() => photosFixture);
      getSuggestedProfiles.mockImplementation(() => suggestedProfilesFixture);
      useUser.mockImplementation(() => ({}));

      const firebase = {
        firestore: jest.fn(() => ({
          collection: jest.fn(() => ({
            doc: jest.fn(() => ({
              update: jest.fn(() => Promise.resolve('User added')),
            })),
          })),
        })),
      };

      const { getByText, queryByText } = render(
        <Router>
          <FirebaseContext.Provider value={{ firebase }}>
            <UserContext.Provider
              value={{
                user: {
                  uid: 'JNoMPWmBTpMcTdAcfvYV51hpODW2',
                  displayName: 'itamar',
                },
              }}
            >
              <LoggedInUserContext.Provider value={{ user: userFixture }}>
                <Dashboard
                  user={{
                    uid: 'JNoMPWmBTpMcTdAcfvYV51hpODW2',
                    displayName: 'itamar',
                  }}
                />
              </LoggedInUserContext.Provider>
            </UserContext.Provider>
          </FirebaseContext.Provider>
        </Router>
      );
      expect(getByText('Login')).toBeTruthy();
      expect(getByText('Sign Up')).toBeTruthy();
      expect(queryByText('Suggestions for you')).toBeFalsy();
    });
  });
});
