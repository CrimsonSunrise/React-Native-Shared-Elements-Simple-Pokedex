import React, { useEffect, useRef, useState } from "react";
import {
	Animated,
	Image,
	Pressable,
	SafeAreaView,
	StyleSheet,
	Text,
	View,
	Dimensions,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import {
	SafeAreaProvider,
	useSafeAreaInsets,
} from "react-native-safe-area-context";
import {
	SharedElement,
	createSharedElementStackNavigator,
} from "react-navigation-shared-element";
import { FlashList } from "@shopify/flash-list";
import { StatusBar } from "expo-status-bar";
import Icon from "react-native-vector-icons/AntDesign";
import { Asset } from "expo-asset";

// Load the hero image and the Pokemon logo from the assets folder
const PokemonHero = Asset.fromModule(require("./assets/hero.png")).uri;
const PokemonText = Asset.fromModule(require("./assets/pokemon.png")).uri;

// Load all the type icons from the assets folder
const water = Asset.fromModule(require("./assets/water.png")).uri;
const fire = Asset.fromModule(require("./assets/fire.png")).uri;
const grass = Asset.fromModule(require("./assets/grass.png")).uri;
const ground = Asset.fromModule(require("./assets/ground.png")).uri;
const rock = Asset.fromModule(require("./assets/rock.png")).uri;
const steel = Asset.fromModule(require("./assets/steel.png")).uri;
const ice = Asset.fromModule(require("./assets/ice.png")).uri;
const electric = Asset.fromModule(require("./assets/electric.png")).uri;
const dragon = Asset.fromModule(require("./assets/dragon.png")).uri;
const ghost = Asset.fromModule(require("./assets/ghost.png")).uri;
const psychic = Asset.fromModule(require("./assets/psychic.png")).uri;
const normal = Asset.fromModule(require("./assets/normal.png")).uri;
const fighting = Asset.fromModule(require("./assets/fighting.png")).uri;
const poison = Asset.fromModule(require("./assets/poison.png")).uri;
const bug = Asset.fromModule(require("./assets/bug.png")).uri;
const flying = Asset.fromModule(require("./assets/flying.png")).uri;
const dark = Asset.fromModule(require("./assets/dark.png")).uri;
const fairy = Asset.fromModule(require("./assets/fairy.png")).uri;

const { width, height } = Dimensions.get("window");

// Set the initial lenght of the pokemon list to be fetched from the API
const INITIALPOKEMONSLENGTH = 50;

// List Screen page
const ListScreen = ({ navigation }) => {
	const [pokemons, setPokemons] = useState([]);

	useEffect(() => {
		fetchPokemons(INITIALPOKEMONSLENGTH, 0);
	}, []);

	function fetchPokemons(amount, offset) {
		fetch(
			`https://pokeapi.co/api/v2/pokemon/?limit=${amount}&offset=${offset}`,
			{
				method: "GET",
			}
		)
			.then((res) => res.json())
			.then((res) => {
				let pokemonList = res.results;

				pokemonList.map((pokemon, index) => {
					pokemon.index = index + pokemons.length + 1;
				});

				setPokemons(pokemons.concat(pokemonList));
			})
			.catch((err) => {
				console.log(err);
			});
	}

	function onEndReach() {
		fetchPokemons(INITIALPOKEMONSLENGTH, pokemons.length);
	}

	return (
		<SafeAreaView style={styles.wrapper}>
			<StatusBar style="dark" />

			<View
				style={{
					flex: 0.5,
					height: 200,
					backgroundColor: "transparent",
					justifyContent: "center",
					alignItems: "center",
				}}
			>
				<Image
					style={{
						top: 20,
						width: "60%",
						height: "60%",
						zIndex: 1,
						resizeMode: "cover",
						shadowColor: "#171717",
						shadowOffset: { width: 0, height: 3 },
						shadowOpacity: 0.4,
						shadowRadius: 2,
						elevation: 5,
					}}
					source={{ uri: PokemonHero }}
				/>
				<Image
					style={{
						position: "absolute",
						top: 20,
						width: "80%",
						height: "43%",
						resizeMode: "cover",
					}}
					source={{ uri: PokemonText }}
				/>
			</View>

			<FlashList
				collapsable={false}
				numColumns={3}
				data={pokemons}
				contentContainerStyle={{
					paddingBottom: 30,
				}}
				onEndReached={() => {
					onEndReach();
				}}
				estimatedItemSize={251}
				renderItem={(pokemon, index) => {
					return (
						<Pressable
							key={index}
							onPress={() =>
								navigation.push("Detail", {
									pokemon: pokemon.item,
								})
							}
							style={[styles.pokemonItem]}
						>
							<SharedElement id={pokemon.item.name}>
								<Image
									source={{
										uri: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.item.index}.png`,
									}}
									style={styles.pokemonItemImage}
								/>
							</SharedElement>

							<View style={styles.pokemonItemInfo}>
								<Text
									numberOfLines={1}
									style={styles.pokemonItemName}
								>
									{pokemon.item.name}
								</Text>
							</View>
						</Pressable>
					);
				}}
			/>
		</SafeAreaView>
	);
};

const DetailScreen = ({ route, navigation }) => {
	const { pokemon } = route.params;
	const safeInsets = useSafeAreaInsets();
	const opacity = useRef(new Animated.Value(0)).current;

	const [pokeInfo, setPokeInfo] = useState({});

	const typeIcons = {
		water,
		fire,
		grass,
		ground,
		rock,
		steel,
		ice,
		electric,
		dragon,
		ghost,
		psychic,
		normal,
		fighting,
		poison,
		bug,
		flying,
		dark,
		fairy,
	};

	useEffect(() => {
		fetch(`${pokemon.url}`, { method: "GET" })
			.then((res) => res.json())
			.then((res) => {
				setPokeInfo(res);
			})
			.catch((err) => console.log(err));

		Animated.timing(opacity, {
			toValue: 1,
			duration: 250,
			delay: 200,
			useNativeDriver: true,
		}).start();
	}, []);

	return (
		<View style={styles.pokemonDetailWrapper}>
			<Animated.View
				style={{
					opacity,
					position: "absolute",
					top: safeInsets.top,
					left: safeInsets.left,
					right: safeInsets.right,
					zIndex: 2,
					flexDirection: "row",
					justifyContent: "space-between",
				}}
			>
				<Icon
					style={styles.pokemonDetailCloseButton}
					name="close"
					size={30}
					onPress={() => navigation.goBack()}
					color="#000"
				/>
			</Animated.View>

			<SharedElement
				id={pokemon.name}
				style={{ backgroundColor: "transparent", zIndex: 1 }}
			>
				<Image
					source={{
						uri: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.index}.png`,
					}}
					style={styles.pokemonDetailImage}
				/>
			</SharedElement>

			<Animated.View style={styles.pokemonDetails}>
				<View style={styles.pokemonDetailsHeader}>
					<View style={styles.pokemonTitle}>
						<Text style={styles.pokemonName}>{pokemon.name}</Text>

						{pokeInfo?.id && (
							<Text
								style={styles.pokemonId}
							>{`#${pokeInfo.id}`}</Text>
						)}
					</View>

					<View style={styles.pokemonTypes}>
						{pokeInfo?.types?.map((type, index) => {
							return (
								<View
									key={`type-${index}`}
									style={[
										styles.pokemonType,
										styles[type.type.name],
									]}
								>
									<Image
										style={styles.pokemonTypeImage}
										source={{
											uri: typeIcons[type.type.name],
										}}
									/>
									<Text style={styles.pokemonTypeLabel}>
										{type.type.name}
									</Text>
								</View>
							);
						})}
					</View>
				</View>

				{pokeInfo?.stats && (
					<Animated.View>
						<View style={styles.statsView}>
							<Text style={styles.statsKey}>Height</Text>
							<Text
								style={styles.dots}
								ellipsizeMode="clip"
								numberOfLines={1}
							>
								...................................................................................
							</Text>
							<Text style={styles.statsValue}>
								{pokeInfo.height}
							</Text>
						</View>

						<View style={styles.statsView}>
							<Text style={styles.statsKey}>Weight</Text>
							<Text
								style={styles.dots}
								ellipsizeMode="clip"
								numberOfLines={1}
							>
								...................................................................................
							</Text>
							<Text style={styles.statsValue}>
								{pokeInfo.weight}
							</Text>
						</View>

						{pokeInfo?.stats?.map((status, index) => {
							return (
								<View
									key={`stats-${index}`}
									style={styles.statsView}
								>
									<Text style={styles.statsKey}>
										{`${status.stat.name.replace(
											"-",
											" "
										)} `}
									</Text>
									<Text
										style={styles.dots}
										ellipsizeMode="clip"
										numberOfLines={1}
									>
										...................................................................................
									</Text>
									<Text style={styles.statsValue}>
										{status.base_stat}
									</Text>
								</View>
							);
						})}
					</Animated.View>
				)}
			</Animated.View>
		</View>
	);
};

const Stack = createSharedElementStackNavigator();

const MainScreen = () => (
	<Stack.Navigator mode="modal" screenOptions={{ headerShown: false }}>
		<Stack.Screen name="List" component={ListScreen} />

		<Stack.Screen
			name="Detail"
			component={DetailScreen}
			sharedElements={(route) => {
				return [route.params.pokemon.name];
			}}
		/>
	</Stack.Navigator>
);

export default function App() {
	return (
		<SafeAreaProvider>
			<NavigationContainer>
				<MainScreen />
			</NavigationContainer>
		</SafeAreaProvider>
	);
}

const styles = StyleSheet.create({
	wrapper: {
		flex: 1,
		padding: 10,
		paddingTop: 40,
		backgroundColor: "#f1f5f9",
	},
	pokemonItem: {
		backgroundColor: "#f8fafc",
		margin: 0,
		width: width / 3 - 20,
		margin: 5,
		paddingTop: 8,
		borderRadius: 8,
		justifyContent: "center",
		alignItems: "center",
		elevation: 5,
	},
	pokemonItemImage: {
		width: 100,
		height: 100,
		resizeMode: "cover",
	},
	pokemonItemInfo: {
		margin: 10,
		marginBottom: 15,
	},
	pokemonItemName: {
		fontSize: 16,
		fontWeight: "500",
		textTransform: "capitalize",
	},
	pokemonDetailWrapper: {
		flex: 1,
		padding: 10,
		paddingTop: 40,
		backgroundColor: "#f1f5f9",
	},
	pokemonDetailCloseButton: {
		padding: 10,
		left: 20,
		top: 20,
		backgroundColor: "transparent",
		zIndex: 2,
	},
	pokemonDetailBackground: {
		display: "none",
	},
	pokemonDetailImage: {
		top: 0,
		height: 390,
		width: "100%",
		resizeMode: "cover",
		backgroundColor: "transparent",
		transform: [
			{
				scale: 1,
			},
		],
		zIndex: 10,
	},
	pokemonDetails: {
		flex: 1,
		bottom: 0,
		paddingVertical: 10,
		paddingHorizontal: 20,
		zIndex: 1,
		backgroundColor: "white",
		justifyContent: "space-between",
		borderRadius: 20,
		elevation: 2,
		zIndex: 0,
	},
	pokemonDetailsHeader: {
		justifyContent: "space-between",
	},
	pokemonTitle: {
		flexDirection: "row",
		backgroundColor: "transparent",
		alignItems: "center",
		justifyContent: "space-between",
		marginBottom: 10,
	},
	pokemonName: {
		fontSize: 32,
		fontWeight: "600",
		textTransform: "capitalize",
		color: "#222"
	},
	pokemonId: { color: "#888", fontSize: 16 },
	pokemonTypes: { flexDirection: "row" },
	pokemonType: {
		alignSelf: "flex-start",
		borderRadius: 30,
		alignItems: "center",
		justifyContent: "center",
		flexDirection: "row",
		backgroundColor: "white",
		padding: 5,
		marginRight: 5,
		elevation: 3,
	},
	pokemonTypeImage: {
		width: 20,
		height: 20,
		resizeMode: "cover",
		marginRight: 5,
	},
	pokemonTypeLabel: {
		alignSelf: "center",
		bottom: 1,
		marginRight: 5,
		textTransform: "capitalize",
		color: "white",
	},
	statsView: {
		display: "flex",
		flexDirection: "row",
		backgroundColor: "transparent",
		justifyContent: "space-between",
		alignItems: "flex-end",
		paddingVertical: 5,
	},
	statsKey: {
		textTransform: "capitalize",
		color: "#888",
		fontSize: 18,
	},
	statsValue: {
		fontSize: 18,
		fontWeight: "600",
		color: "#222"
	},
	dots: {
		backgroundColor: "transparent",
		flex: 1,
		paddingHorizontal: 5,
		color: "#DDD",
	},
	water: { backgroundColor: "#4F8FC8" },
	fire: { backgroundColor: "#F7985E" },
	grass: { backgroundColor: "#65B962" },
	ground: { backgroundColor: "#D8764C" },
	rock: { backgroundColor: "#C5B58C" },
	steel: { backgroundColor: "#5B8FA0" },
	ice: { backgroundColor: "#76C8BC" },
	electric: { backgroundColor: "#F3D04E" },
	dragon: { backgroundColor: "#226FB1" },
	ghost: { backgroundColor: "#526BA9" },
	psychic: { backgroundColor: "#F06E77" },
	normal: { backgroundColor: "#8F989F" },
	fighting: { backgroundColor: "#CD4169" },
	poison: { backgroundColor: "#9E6DAA" },
	bug: { backgroundColor: "#8FC04D" },
	flying: { backgroundColor: "#92AAD4" },
	dark: { backgroundColor: "#5B5566" },
	fairy: { backgroundColor: "#D393BE" },
});
