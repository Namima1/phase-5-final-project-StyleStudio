from config import db, app
from models import User, ClothingItem, Outfit, OutfitItem
from faker import Faker

fake = Faker()

def seed_data():
    try:
        with app.app_context():
            print("Seeding database...")

            # Clear existing data
            db.session.query(OutfitItem).delete()
            db.session.query(Outfit).delete()
            db.session.query(ClothingItem).delete()
            db.session.query(User).delete()
            db.session.commit()
            print("Database cleared.")

            # Add multiple users
            users = []
            for _ in range(5):
                user = User(username=fake.user_name(), email=fake.email())
                users.append(user)
                db.session.add(user)
            db.session.commit()
            print(f"Added {len(users)} users.")

            # Add clothing items for each user
            clothing_items = []
            for user in users:
                for _ in range(3):  # Each user gets 3 clothing items
                    item = ClothingItem(
                        name=fake.word().capitalize(),
                        category=fake.random_element(elements=("Tops", "Bottoms", "Accessories", "Shoes")),
                        user_id=user.id
                    )
                    clothing_items.append(item)
                    db.session.add(item)
            db.session.commit()
            print(f"Added {len(clothing_items)} clothing items.")

            # Add outfits for each user
            outfits = []
            for user in users:
                outfit = Outfit(name=fake.word().capitalize() + " Outfit", user_id=user.id)
                outfits.append(outfit)
                db.session.add(outfit)
            db.session.commit()
            print(f"Added {len(outfits)} outfits.")

            # Add outfit items (randomly assigning clothing items to outfits)
            outfit_items = []
            for outfit in outfits:
                outfit_clothing_items = fake.random_choices(clothing_items, length=2)  # Each outfit gets 2 items
                for item in outfit_clothing_items:
                    outfit_item = OutfitItem(outfit_id=outfit.id, clothing_item_id=item.id)
                    outfit_items.append(outfit_item)
                    db.session.add(outfit_item)
            db.session.commit()
            print(f"Added {len(outfit_items)} outfit items.")

            print("Database seeded successfully!")

    except Exception as e:
        print(f"Error occurred during seeding: {e}")

if __name__ == '__main__':
    seed_data()
    
users = [
    {"username": "bflores", "email": "wilsonbilly@example.com", "password": "password123"},
    {"username": "burnsarthur", "email": "christopherdavies@example.com", "password": "password123"},
]