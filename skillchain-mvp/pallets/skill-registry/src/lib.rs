#![cfg_attr(not(feature = "std"), no_std)]

use frame_support::{
    dispatch::DispatchResult,
    pallet_prelude::*,
    traits::Get,
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
        #[pallet::constant]
        type MaxMetadataLength: Get<u32>;
    }

    pub type SkillId = u32;

    #[derive(Encode, Decode, Clone, PartialEq, Eq, RuntimeDebug, TypeInfo)]
    pub struct SkillInfo<AccountId, BlockNumber> {
        pub owner: AccountId,
        pub metadata_cid: Vec<u8>,
        pub issued_by: AccountId,
        pub issued_at: BlockNumber,
        pub soulbound: bool,
        pub verified: bool,
    }

    #[pallet::storage]
    pub type Skills<T: Config> = StorageMap<
        _,
        Blake2_128Concat,
        SkillId,
        SkillInfo<T::AccountId, BlockNumberFor<T>>,
    >;

    #[pallet::storage]
    pub type AccountSkills<T: Config> = StorageMap<
        _,
        Blake2_128Concat,
        T::AccountId,
        Vec<SkillId>,
        ValueQuery,
    >;

    #[pallet::storage]
    pub type NextSkillId<T: Config> = StorageValue<_, SkillId, ValueQuery>;

    #[pallet::event]
    #[pallet::generate_deposit(pub(super) fn deposit_event)]
    pub enum Event<T: Config> {
        SkillMinted { skill_id: SkillId, owner: T::AccountId },
        SkillVerified { skill_id: SkillId },
    }

    #[pallet::error]
    pub enum Error<T> {
        SkillNotFound,
        NotOwner,
        MetadataTooLong,
    }

    #[pallet::call]
    impl<T: Config> Pallet<T> {
        #[pallet::call_index(0)]
        #[pallet::weight(10_000)]
        pub fn mint_skill(
            origin: OriginFor<T>,
            metadata_cid: Vec<u8>,
            soulbound: bool,
        ) -> DispatchResult {
            let who = ensure_signed(origin)?;
            
            ensure!(
                metadata_cid.len() <= T::MaxMetadataLength::get() as usize,
                Error::<T>::MetadataTooLong
            );

            let skill_id = NextSkillId::<T>::get();
            let current_block = frame_system::Pallet::<T>::block_number();

            let skill_info = SkillInfo {
                owner: who.clone(),
                metadata_cid,
                issued_by: who.clone(),
                issued_at: current_block,
                soulbound,
                verified: false,
            };

            Skills::<T>::insert(&skill_id, &skill_info);
            AccountSkills::<T>::mutate(&who, |skills| skills.push(skill_id));
            NextSkillId::<T>::put(skill_id + 1);

            Self::deposit_event(Event::SkillMinted { skill_id, owner: who });
            Ok(())
        }

        #[pallet::call_index(1)]
        #[pallet::weight(10_000)]
        pub fn verify_skill(
            origin: OriginFor<T>,
            skill_id: SkillId,
        ) -> DispatchResult {
            let _who = ensure_signed(origin)?;
            
            Skills::<T>::try_mutate(&skill_id, |skill_opt| -> DispatchResult {
                let skill = skill_opt.as_mut().ok_or(Error::<T>::SkillNotFound)?;
                skill.verified = true;
                Ok(())
            })?;

            Self::deposit_event(Event::SkillVerified { skill_id });
            Ok(())
        }
    }
}