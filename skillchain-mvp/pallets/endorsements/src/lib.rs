#![cfg_attr(not(feature = "std"), no_std)]

use frame_support::{
    dispatch::DispatchResult,
    pallet_prelude::*,
    traits::{Currency, ReservableCurrency},
};
use frame_system::pallet_prelude::*;
use sp_std::vec::Vec;

pub use pallet::*;

#[frame_support::pallet]
pub mod pallet {
    use super::*;

    #[pallet::pallet]
    pub struct Pallet<T>(_);

    #[pallet::config]
    pub trait Config: frame_system::Config {
        type RuntimeEvent: From<Event<Self>> + IsType<<Self as frame_system::Config>::RuntimeEvent>;
        type Currency: Currency<Self::AccountId> + ReservableCurrency<Self::AccountId>;
    }

    pub type SkillId = u32;
    pub type Balance<T> = <<T as Config>::Currency as Currency<<T as frame_system::Config>::AccountId>>::Balance;

    #[derive(Encode, Decode, Clone, PartialEq, Eq, RuntimeDebug, TypeInfo)]
    pub struct Endorsement<AccountId, Balance> {
        pub endorser: AccountId,
        pub stake: Balance,
    }

    #[pallet::storage]
    pub type Endorsements<T: Config> = StorageMap<
        _,
        Blake2_128Concat,
        SkillId,
        Vec<Endorsement<T::AccountId, Balance<T>>>,
        ValueQuery,
    >;

    #[pallet::storage]
    pub type SkillScores<T: Config> = StorageMap<
        _,
        Blake2_128Concat,
        SkillId,
        Balance<T>,
        ValueQuery,
    >;

    #[pallet::event]
    #[pallet::generate_deposit(pub(super) fn deposit_event)]
    pub enum Event<T: Config> {
        SkillEndorsed { 
            skill_id: SkillId, 
            endorser: T::AccountId, 
            stake: Balance<T> 
        },
    }

    #[pallet::error]
    pub enum Error<T> {
        InsufficientBalance,
        AlreadyEndorsed,
    }

    #[pallet::call]
    impl<T: Config> Pallet<T> {
        #[pallet::call_index(0)]
        #[pallet::weight(10_000)]
        pub fn endorse_skill(
            origin: OriginFor<T>,
            skill_id: SkillId,
            stake: Balance<T>,
        ) -> DispatchResult {
            let who = ensure_signed(origin)?;

            // Reserve the stake
            T::Currency::reserve(&who, stake)
                .map_err(|_| Error::<T>::InsufficientBalance)?;

            let endorsement = Endorsement {
                endorser: who.clone(),
                stake,
            };

            Endorsements::<T>::mutate(&skill_id, |endorsements| {
                endorsements.push(endorsement);
            });

            SkillScores::<T>::mutate(&skill_id, |score| {
                *score = score.saturating_add(stake);
            });

            Self::deposit_event(Event::SkillEndorsed { 
                skill_id, 
                endorser: who, 
                stake 
            });

            Ok(())
        }
    }
}