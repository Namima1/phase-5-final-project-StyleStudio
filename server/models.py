from config import db
from sqlalchemy_serializer import SerializerMixin

class User(db.Model, SerializerMixin):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, nullable=False, unique=True)
    email = db.Column(db.String, nullable=False, unique=True)
    password = db.Column(db.String, nullable=False)

    clothing_items = db.relationship('ClothingItem', back_populates='user', cascade="all, delete-orphan")
    outfits = db.relationship('Outfit', back_populates='user', cascade="all, delete-orphan")

    def __repr__(self):
        return f'<User {self.username}>'

class ClothingItem(db.Model, SerializerMixin):
    __tablename__ = 'clothing_items'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    category = db.Column(db.String, nullable=False)
    image_url = db.Column(db.String, nullable=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)

    user = db.relationship('User', back_populates='clothing_items')
    outfit_items = db.relationship('OutfitItem', back_populates='clothing_item', cascade="all, delete-orphan")

    def __repr__(self):
        return f'<ClothingItem {self.name}>'

class Outfit(db.Model, SerializerMixin):
    __tablename__ = 'outfits'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)

    user = db.relationship('User', back_populates='outfits')
    outfit_items = db.relationship('OutfitItem', back_populates='outfit', cascade="all, delete-orphan")

    def __repr__(self):
        return f'<Outfit {self.name}>'

class OutfitItem(db.Model, SerializerMixin):
    __tablename__ = 'outfit_items'

    id = db.Column(db.Integer, primary_key=True)
    outfit_id = db.Column(db.Integer, db.ForeignKey('outfits.id'), nullable=False)
    clothing_item_id = db.Column(db.Integer, db.ForeignKey('clothing_items.id'), nullable=False)

    outfit = db.relationship('Outfit', back_populates='outfit_items')
    clothing_item = db.relationship('ClothingItem', back_populates='outfit_items')

    def __repr__(self):
        return f'<OutfitItem {self.outfit_id} - {self.clothing_item_id}>'